import { useCallback, useMemo } from "react"
import { type WorkSheet, utils, writeFile } from "xlsx"

import type { Column } from "@/utils/types"
import { NOTFOUND } from "@/utils"

type OutputTableProps = {
	masterSheet: WorkSheet | null
	inputSheet: WorkSheet | null
	masterIndex: Column | null
	inputIndex: Column | null
	masterSelectedColumns: Column[]
	inputSelectedColumns: Column[]
	masterHeaderOffset: number
	inputHeaderOffset: number
	setMissingAsNewMaster: (missingSheet: WorkSheet) => void
	setMissingAsNewInput: (missingSheet: WorkSheet) => void
	setMatchedAsNewMaster: (matchedSheet: WorkSheet) => void
	setMatchedAsNewInput: (matchedSheet: WorkSheet) => void
}

type MatchResult = [
	string[], // Column Headers
	string[][], // Matched Rows
	string[][], // Master Missing Rows
]

const ROW_COUNT_OFFSET = 1 // 1 for header
const MATCHING_ROWS_SHEET_NAME = "Output"
const MASTER_MISSING_ROWS_SHEET_NAME = "Master_Missing"

export function OutputTable(props: OutputTableProps) {
	const {
		inputSelectedColumns,
		inputSheet,
		masterSelectedColumns,
		masterSheet,
		inputIndex,
		masterIndex,
		masterHeaderOffset,
		inputHeaderOffset,
		setMatchedAsNewInput,
		setMatchedAsNewMaster,
		setMissingAsNewInput,
		setMissingAsNewMaster
	} = props

	const inputRowCount = useMemo(() => {
		if (inputSheet === null || inputIndex === null) {
			return 0
		}
		let rowCount = inputHeaderOffset + 1
		while (
			inputSheet[`${inputIndex.columnLabel}${rowCount}`] !== undefined
		) {
			rowCount++
		}
		return rowCount - (1 + ROW_COUNT_OFFSET + inputHeaderOffset)
	}, [inputSelectedColumns, inputSheet])

	const masterRowCount = useMemo(() => {
		if (masterSheet === null || masterIndex === null) {
			return 0
		}
		let rowCount = masterHeaderOffset + 1
		while (
			masterSheet[`${masterIndex.columnLabel}${rowCount}`] !== undefined
		) {
			rowCount++
		}
		return rowCount - (1 + ROW_COUNT_OFFSET + masterHeaderOffset)
	}, [masterSelectedColumns, masterSheet, masterIndex])

	const masterIndexMap = useMemo(() => {
		const masterMap: Record<
			string,
			{
				rowIndex: number
				rowData: Record<string, string>
			}
		> = {}

		if (masterSheet === null || masterIndex === null) {
			return masterMap
		}

		for (
			let rowIndex = masterHeaderOffset + 2;
			rowIndex <= masterRowCount + ROW_COUNT_OFFSET;
			rowIndex++
		) {
			const masterCell =
				masterSheet[`${masterIndex.columnLabel}${rowIndex}`]
			const masterIndexValue = new String(masterCell?.v || NOTFOUND).toString()
			const masterRowData: Record<string, string> = {}
			for (let masterSelectedColumn of masterSelectedColumns) {
				const masterSelectedCell =
					masterSheet[
						`${masterSelectedColumn.columnLabel}${rowIndex}`
					]
				const masterSelectedValue = new String(
					masterSelectedCell?.w || masterSelectedCell?.v || "",
				).toString()

				masterRowData[masterSelectedColumn.columnLabel] =
					masterSelectedValue
			}
			masterMap[masterIndexValue] = {
				rowIndex: rowIndex,
				rowData: masterRowData,
			}
		}

		return masterMap
	}, [masterSheet, masterSelectedColumns, masterIndex])

	const inputIndexMap = useMemo(() => {
		const inputMap: Record<
			string,
			{
				rowIndex: number
				rowData: Record<string, string>
			}
		> = {}

		if (inputSheet === null || inputIndex === null) {
			return inputMap
		}

		for (
			let rowIndex = inputHeaderOffset + 2;
			rowIndex <= inputRowCount + ROW_COUNT_OFFSET;
			rowIndex++
		) {
			const inputCell = inputSheet[`${inputIndex.columnLabel}${rowIndex}`]
			console.log(`${inputIndex.columnLabel}${rowIndex}`, inputCell)
			const inputIndexValue = new String(inputCell?.v || NOTFOUND).toString()
			const inputRowData: Record<string, string> = {}
			for (let inputSelectedColumn of inputSelectedColumns) {
				const inputSelectedCell =
					inputSheet[`${inputSelectedColumn.columnLabel}${rowIndex}`]
				if (!inputSelectedCell) {
					continue
				}
				const inputSelectedValue = new String(
					inputSelectedCell?.w || inputSelectedCell?.v || "",
				).toString()
				inputRowData[inputSelectedColumn.columnLabel] =
					inputSelectedValue
			}
			inputMap[inputIndexValue] = {
				rowIndex: rowIndex,
				rowData: inputRowData,
			}
		}

		return inputMap
	}, [inputSheet, inputSelectedColumns, inputIndex])

	const [outputColumns, outputMatchedRows, outputMissingRows] =
		useMemo(() => {
			if (!inputIndex) {
				return [[], [], []] satisfies MatchResult
			}

			const columnRowPre = [
				inputIndex,
				...inputSelectedColumns,
				...masterSelectedColumns,
			]

			const columnRowPost = columnRowPre.map((colData, colIdx) => {
				return {
					columnIdx: colIdx,
					columnLabel: utils.encode_col(colIdx),
					columnName: colData.columnName,
				}
			})

			const outputColumnArr = columnRowPost.map((columnObj) => {
				return columnObj.columnName
			})

			const bothRecordArr = []
			const masterMissingArr = []

			const inputIndexKeys = Object.keys(inputIndexMap)

			for (
				let inputIndexIdx = 0;
				inputIndexIdx < inputIndexKeys.length;
				inputIndexIdx++
			) {
				const inputIndexKey = inputIndexKeys[inputIndexIdx]
				const inputRowData = inputIndexMap[inputIndexKey].rowData
				const masterRowData = masterIndexMap[inputIndexKey]?.rowData

				const finalRowData = [inputIndexKey]

				for (let inputSelectedColumn of inputSelectedColumns) {
					finalRowData.push(
						inputRowData[inputSelectedColumn.columnLabel],
					)
				}

				if (masterRowData) {
					for (let masterSelectedColumn of masterSelectedColumns) {
						finalRowData.push(
							masterRowData[masterSelectedColumn.columnLabel],
						)
					}
					bothRecordArr.push(finalRowData)
				} else {
					for (let masterSelectedColumn of masterSelectedColumns) {
						finalRowData.push("")
					}
					masterMissingArr.push(finalRowData)
				}
			}

			return [
				outputColumnArr,
				bothRecordArr,
				masterMissingArr,
			] satisfies MatchResult
		}, [
			masterIndexMap,
			inputIndexMap,
			inputIndex,
			masterSelectedColumns,
			inputSelectedColumns,
		])

	const onExportMatchedClick = useCallback(() => {
		const exportWorkbook = utils.book_new()
		const outputMatchedSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMatchedRows,
		])

		utils.book_append_sheet(
			exportWorkbook,
			outputMatchedSheet,
			MATCHING_ROWS_SHEET_NAME,
		)

		const excelFileName = `Excello-${new Date().toISOString()}.xlsx`

		writeFile(exportWorkbook, excelFileName)
	}, [outputColumns, outputMatchedRows])

	const onExportMissingClick = useCallback(() => {
		const exportWorkbook = utils.book_new()
		const outputMissingSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMissingRows,
		])

		utils.book_append_sheet(
			exportWorkbook,
			outputMissingSheet,
			MASTER_MISSING_ROWS_SHEET_NAME,
		)

		const excelFileName = `Excello-${new Date().toISOString()}.xlsx`

		writeFile(exportWorkbook, excelFileName)
	}, [outputColumns, outputMissingRows])

	const onExportBothClick = useCallback(() => {
		const exportWorkbook = utils.book_new()
		const outputMatchedSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMatchedRows,
		])

		const outputMissingSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMissingRows,
		])

		utils.book_append_sheet(
			exportWorkbook,
			outputMatchedSheet,
			MATCHING_ROWS_SHEET_NAME,
		)

		utils.book_append_sheet(
			exportWorkbook,
			outputMissingSheet,
			MASTER_MISSING_ROWS_SHEET_NAME,
		)

		const excelFileName = `Excello-${new Date().toISOString()}.xlsx`

		writeFile(exportWorkbook, excelFileName)
	}, [outputColumns, outputMatchedRows, outputMissingRows])

	const onSetMissingAsNewMasterClick = useCallback(() => {
		const missingSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMissingRows,
		])
		setMissingAsNewMaster(missingSheet)
	}, [outputColumns, outputMissingRows, setMissingAsNewMaster])

	const onSetMissingAsNewInputClick = useCallback(() => {
		const missingSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMissingRows,
		])
		setMissingAsNewInput(missingSheet)
	}, [outputColumns, outputMissingRows, setMissingAsNewInput])

	const onSetMatchedAsNewMasterClick = useCallback(() => {
		const matchedSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMatchedRows,
		])
		setMatchedAsNewMaster(matchedSheet)
	}, [outputColumns, outputMatchedRows, setMatchedAsNewMaster])

	const onSetMatchedAsNewInputClick = useCallback(() => {
		const matchedSheet = utils.aoa_to_sheet([
			outputColumns,
			...outputMatchedRows,
		])
		setMatchedAsNewInput(matchedSheet)
	}, [outputColumns, outputMatchedRows, setMatchedAsNewInput])

	return (
		<div
			className={"flex w-full flex-col items-start justify-between gap-4"}
		>
			<h2 className={"text-2xl font-bold"}>
				5a. Output Table ({masterRowCount} Master Rows, {inputRowCount}{" "}
				Input Rows, {outputMatchedRows.length} Matched Rows)
			</h2>
			<p className={"ml-4"}>
				The index column will be selected first, then input columns,
				followed by master record columns
			</p>
			<table>
				<tbody>
					<tr>
						{outputColumns.map((columnName, colIdx) => {
							return (
								<th
									key={colIdx}
									className={
										"border border-black p-2 text-left"
									}
								>
									{columnName}
								</th>
							)
						})}
					</tr>
					{outputMatchedRows.map((rowData, rowIdx) => {
						return (
							<tr key={rowIdx}>
								{rowData.map((cellData, cellIdx) => {
									return (
										<td
											key={`${rowIdx}${cellIdx}`}
											className={
												"border border-black p-2"
											}
										>
											{cellData}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			<h2 className={"text-2xl font-bold"}>
				5b. {outputMissingRows.length} Input Rows Missing in Master
			</h2>
			<p className={"ml-4"}>
				The input index value ({inputIndex?.columnName}) is not found in
				the master index ({masterIndex?.columnName})
			</p>
			<table>
				<tbody>
					<tr>
						{outputColumns.map((columnName, colIdx) => {
							return (
								<th
									key={colIdx}
									className={
										"border border-black p-2 text-left"
									}
								>
									{columnName}
								</th>
							)
						})}
					</tr>
					{outputMissingRows.map((rowData, rowIdx) => {
						return (
							<tr key={rowIdx}>
								{rowData.map((cellData, cellIdx) => {
									return (
										<td
											key={`${rowIdx}${cellIdx}`}
											className={
												"border border-black p-2"
											}
										>
											{cellData}
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
			<div
				className={
					"flex w-full flex-row items-center justify-between gap-4"
				}
			>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onExportMatchedClick}
				>
					Export Matched
				</button>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onExportMissingClick}
				>
					Export Missing
				</button>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onExportBothClick}
				>
					Export Both
				</button>
			</div>
			<div
				className={
					"flex w-full flex-row items-center justify-between gap-4"
				}
			>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onSetMissingAsNewMasterClick}
				>
					Set Missing as New Master
				</button>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onSetMissingAsNewInputClick}
				>
					Set Missing as New Input
				</button>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onSetMatchedAsNewMasterClick}
				>
					Set Matched as New Master
				</button>
				<button
					className={
						"w-full cursor-pointer self-center rounded border bg-white p-4 text-black"
					}
					onClick={onSetMatchedAsNewInputClick}
				>
					Set Matched as New Input
				</button>
			</div>
		</div>
	)
}
