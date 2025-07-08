import { ColumnSelect } from "@/components/index/column-select"
import { FileSelect } from "@/components/index/file-select"
import { IndexSelect } from "@/components/index/index-select"
import { OutputTable } from "@/components/index/output-table"
import { SheetSelect } from "@/components/index/sheet-select"
import { useEffect, useMemo, useState } from "react"
import { WorkBook, read, utils, type WorkSheet } from "xlsx"

import type { Column } from "@/utils/types"

export function IndexPage() {
	const [masterRecord, setMasterRecord] = useState<File | null>(null)
	const [inputRecord, setInputRecord] = useState<File | null>(null)

	const [masterWorkbook, setMasterWorkbook] = useState<WorkBook | null>(null)
	const [inputWorkbook, setInputWorkbook] = useState<WorkBook | null>(null)

	const [masterSheetName, setMasterSheetName] = useState<string | null>(null)
	const [inputSheetName, setInputSheetName] = useState<string | null>(null)

	const [masterIndex, setMasterIndex] = useState<Column | null>(null)
	const [inputIndex, setInputIndex] = useState<Column | null>(null)

	const [masterHeaderOffset, setMasterHeaderOffset] = useState<number>(0)
	const [inputHeaderOffset, setInputHeaderOffset] = useState<number>(0)

	const [selectedMasterColumns, setSelectedMasterColumns] = useState<
		Column[]
	>([])
	const [selectedInputColumns, setSelectedInputColumns] = useState<Column[]>(
		[],
	)

	useEffect(() => {
		if (masterRecord === null) {
			return
		}
		const fileReader = new FileReader()
		fileReader.onload = (e) => {
			const dataArray = new Uint8Array(e.target?.result as ArrayBuffer)
			const workbookHandle = read(dataArray, { type: "array" })
			setMasterWorkbook(workbookHandle)
		}
		fileReader.readAsArrayBuffer(masterRecord)
	}, [masterRecord])

	useEffect(() => {
		if (inputRecord === null) {
			return
		}
		const fileReader = new FileReader()
		fileReader.onload = (e) => {
			const dataArray = new Uint8Array(e.target?.result as ArrayBuffer)
			const workbookHandle = read(dataArray, { type: "array" })
			setInputWorkbook(workbookHandle)
		}
		fileReader.readAsArrayBuffer(inputRecord)
	}, [inputRecord])

	const masterSheetNames = useMemo(() => {
		if (masterWorkbook === null) {
			return []
		}
		const sheetNames = masterWorkbook.SheetNames
		if (sheetNames.length === 0) {
			return []
		}

		setMasterSheetName(sheetNames[0])

		return sheetNames
	}, [masterWorkbook])

	const inputSheetNames = useMemo(() => {
		if (inputWorkbook === null) {
			return []
		}
		const sheetNames = inputWorkbook.SheetNames
		if (sheetNames.length === 0) {
			return []
		}

		setInputSheetName(sheetNames[0])

		return sheetNames
	}, [inputWorkbook])

	const masterSheet = useMemo(() => {
		if (masterSheetName === null || masterWorkbook === null) {
			return null
		}
		const masterSheetHandle = masterWorkbook.Sheets[masterSheetName]
		if (masterSheetHandle === undefined) {
			return null
		}
		return masterSheetHandle
	}, [masterSheetName, masterWorkbook])

	const inputSheet = useMemo(() => {
		if (inputSheetName === null || inputWorkbook === null) {
			return null
		}
		const inputSheetHandle = inputWorkbook.Sheets[inputSheetName]
		if (inputSheetHandle === undefined) {
			return null
		}
		return inputSheetHandle
	}, [inputSheetName, inputWorkbook])

	const masterSheetColumns = useMemo(() => {
		if (masterSheet === null) {
			return []
		}

		let columnArr: Column[] = []

		let columnCount = 0

		while (
			masterSheet[
				`${utils.encode_col(columnCount)}${masterHeaderOffset + 1}`
			] !== undefined
		) {
			const colCell =
				masterSheet[
					`${utils.encode_col(columnCount)}${masterHeaderOffset + 1}`
				]
			columnArr.push({
				columnIdx: columnCount,
				columnLabel: utils.encode_col(columnCount),
				columnName: colCell.v || utils.encode_col(columnCount),
			})

			columnCount += 1
		}

		return columnArr
	}, [masterSheet, masterHeaderOffset])

	const inputSheetColumns = useMemo(() => {
		if (inputSheet === null) {
			return []
		}

		let columnArr: Column[] = []

		let columnCount = 0

		while (
			inputSheet[
				`${utils.encode_col(columnCount)}${inputHeaderOffset + 1}`
			] !== undefined
		) {
			const colCell =
				inputSheet[
					`${utils.encode_col(columnCount)}${inputHeaderOffset + 1}`
				]
			columnArr.push({
				columnIdx: columnCount,
				columnLabel: utils.encode_col(columnCount),
				columnName: colCell.v || utils.encode_col(columnCount),
			})
			columnCount += 1
		}

		return columnArr
	}, [inputSheet, inputHeaderOffset])

	/* Display logic */
	const showSheetSelect = !!(masterRecord && inputRecord)
	const showIndexSelect = !!(masterSheet && inputSheet)
	const showColumnSelect = !!(masterIndex && inputIndex)
	const showOutput = !!(masterIndex && inputIndex)

	/* Event Handlers */
	const onMasterColumnSelect = (columnData: Column) => {
		const isColumnAlreadySelected = selectedMasterColumns.find(
			(selectedCol) => {
				if (selectedCol.columnLabel === columnData.columnLabel) {
					return true
				}
			},
		)
		if (isColumnAlreadySelected) {
			return
		}
		setSelectedMasterColumns((prevCols) => [...prevCols, columnData])
	}

	const onInputColumnSelect = (columnData: Column) => {
		const isColumnAlreadySelected = selectedInputColumns.find(
			(selectedCol) => {
				if (selectedCol.columnLabel === columnData.columnLabel) {
					return true
				}
			},
		)
		if (isColumnAlreadySelected) {
			return
		}
		setSelectedInputColumns((prevCols) => [...prevCols, columnData])
	}

	const onMasterColumnDeselect = (columnData: Column) => {
		setSelectedMasterColumns((prevCols) =>
			prevCols.filter((prevCol) => {
				if (prevCol.columnLabel !== columnData.columnLabel) {
					return true
				}
				return false
			}),
		)
	}

	const onInputColumnDeselect = (columnData: Column) => {
		setSelectedInputColumns((prevCols) =>
			prevCols.filter((prevCol) => {
				if (prevCol.columnLabel !== columnData.columnLabel) {
					return true
				}
				return false
			}),
		)
	}

	const setMatchedAsNewInput = (newWorkSheet: WorkSheet) => {
		const virtualWorkbook = utils.book_new()
		utils.book_append_sheet(virtualWorkbook, newWorkSheet, "Previously Matched")	
		setInputWorkbook(virtualWorkbook)
		setSelectedInputColumns([])
	} 
	const setMatchedAsNewMaster = (newWorkSheet: WorkSheet) => {
		const virtualWorkbook = utils.book_new()
		utils.book_append_sheet(virtualWorkbook, newWorkSheet, "Previously Matched")	
		setMasterWorkbook(virtualWorkbook)
		setSelectedMasterColumns([])
	} 
	const setMissingAsNewInput = (newWorkSheet: WorkSheet) => {
		const virtualWorkbook = utils.book_new()
		utils.book_append_sheet(virtualWorkbook, newWorkSheet, "Previously Missing")	
		setInputWorkbook(virtualWorkbook)
		setSelectedInputColumns([])
	} 
	const setMissingAsNewMaster = (newWorkSheet: WorkSheet) => {
		const virtualWorkbook = utils.book_new()
		utils.book_append_sheet(virtualWorkbook, newWorkSheet, "Previously Missing")	
		setMasterWorkbook(virtualWorkbook)
		setSelectedInputColumns([])
	} 

	return (
		<div
			className={
				"m-4 flex min-h-svh flex-col items-center justify-start gap-4 rounded border p-4"
			}
		>
			<FileSelect
				onMasterRecordChange={setMasterRecord}
				onInputRecordChange={setInputRecord}
			/>
			{showSheetSelect ? (
				<>
					<hr className={"w-full border-black"} />
					<SheetSelect
						masterSheetOptions={masterSheetNames}
						onMasterSheetSelect={setMasterSheetName}
						inputSheetOptions={inputSheetNames}
						onInputSheetSelect={setInputSheetName}
						masterHeaderOffset={masterHeaderOffset}
						setMasterHeaderOffset={setMasterHeaderOffset}
						inputHeaderOffset={inputHeaderOffset}
						setInputHeaderOffset={setInputHeaderOffset}
					/>
				</>
			) : null}
			{showIndexSelect ? (
				<>
					<hr className={"w-full border-black"} />
					<IndexSelect
						masterColumns={masterSheetColumns}
						inputColumns={inputSheetColumns}
						masterIndex={masterIndex}
						inputIndex={inputIndex}
						onMasterIndexSelect={setMasterIndex}
						onInputIndexSelect={setInputIndex}
					/>
				</>
			) : null}
			{showColumnSelect ? (
				<>
					<hr className={"w-full border-black"} />
					<ColumnSelect
						masterColumns={masterSheetColumns}
						inputColumns={inputSheetColumns}
						masterIndex={masterIndex}
						inputIndex={inputIndex}
						masterSelectedColumns={selectedMasterColumns}
						inputSelectedColumns={selectedInputColumns}
						onMasterColumnSelect={onMasterColumnSelect}
						onInputColumnSelect={onInputColumnSelect}
						onMasterColumnDeselect={onMasterColumnDeselect}
						onInputColumnDeselect={onInputColumnDeselect}
					/>
				</>
			) : null}
			{showOutput ? (
				<>
					<hr className={"w-full border-black"} />
					<OutputTable
						masterSheet={masterSheet}
						inputSheet={inputSheet}
						masterIndex={masterIndex}
						inputIndex={inputIndex}
						masterSelectedColumns={selectedMasterColumns}
						inputSelectedColumns={selectedInputColumns}
						masterHeaderOffset={masterHeaderOffset}
						inputHeaderOffset={inputHeaderOffset}
						setMatchedAsNewInput={setMatchedAsNewInput}
						setMatchedAsNewMaster={setMatchedAsNewMaster}
						setMissingAsNewInput={setMissingAsNewInput}
						setMissingAsNewMaster={setMissingAsNewMaster}
					/>
				</>
			) : null}
		</div>
	)
}
