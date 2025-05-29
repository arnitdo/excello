import { useCallback } from "react"

import type { Column } from "@/utils/types"

type ColumnSelectProps = {
	masterColumns: Column[]
	inputColumns: Column[]
	masterIndex: Column | null
	inputIndex: Column | null
	masterSelectedColumns: Column[]
	inputSelectedColumns: Column[]
	onMasterColumnSelect: (column: Column) => void
	onInputColumnSelect: (column: Column) => void
	onMasterColumnDeselect: (column: Column) => void
	onInputColumnDeselect: (column: Column) => void
}

export function ColumnSelect(props: ColumnSelectProps) {
	const {
		inputColumns,
		masterColumns,
		masterIndex,
		inputIndex,
		onInputColumnSelect,
		onMasterColumnSelect,
		masterSelectedColumns,
		inputSelectedColumns,
		onMasterColumnDeselect,
		onInputColumnDeselect,
	} = props

	const selectAllMasterColumns = useCallback(() => {
		masterColumns.forEach((masterColumn) => {
			onMasterColumnSelect(masterColumn)
		})
	}, [masterColumns, onMasterColumnSelect])
	const deselectAllMasterColumns = useCallback(() => {
		masterColumns.forEach((masterColumn) => {
			onMasterColumnDeselect(masterColumn)
		})
	}, [masterColumns, onMasterColumnDeselect])
	const selectAllInputColumns = useCallback(() => {
		inputColumns.forEach((inputColumn) => {
			if (inputIndex) {
				if (inputColumn.columnName === inputIndex.columnName) {
					return
				}
			}
			onInputColumnSelect(inputColumn)
		})
	}, [inputColumns, onInputColumnSelect])
	const deselectAllInputColumns = useCallback(() => {
		inputColumns.forEach((inputColumn) => {
			if (inputIndex) {
				if (inputColumn.columnName === inputIndex.columnName) {
					return
				}
			}
			onInputColumnDeselect(inputColumn)
		})
	}, [inputColumns, onInputColumnDeselect])

	return (
		<div
			className={"flex w-full flex-col items-start justify-between gap-4"}
		>
			<h2 className={"text-2xl font-bold"}>4. Select Columns</h2>
			<p className={"ml-4"}>
				Select the columns to be used for the master and input records.
			</p>
			<div
				className={
					"flex w-full flex-row items-start justify-between gap-2"
				}
			>
				<div
					className={
						"flex flex-grow flex-col items-start justify-between gap-4 rounded border border-gray-200 p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Master Columns
					</h5>
					<div
						className={
							"flex flex-col items-start justify-between gap-2"
						}
					>
						{masterColumns.map((masterColumn) => {
							const columnCheckedInArr =
								masterSelectedColumns.find((selectedCol) => {
									return (
										selectedCol.columnLabel ===
										masterColumn.columnLabel
									)
								})

							// const columnIsIndex =
							// 	masterColumn.columnLabel ===
							// 	masterIndex?.columnLabel

							const columnChecked = !!columnCheckedInArr

							return (
								<div
									className={
										"flex flex-row items-center justify-between gap-1"
									}
									key={masterColumn.columnLabel}
								>
									<input
										value={masterColumn.columnLabel}
										type={"checkbox"}
										// disabled={columnIsIndex}
										checked={columnChecked}
										onChange={(e) => {
											if (e.target.checked) {
												onMasterColumnSelect(
													masterColumn,
												)
											} else {
												onMasterColumnDeselect(
													masterColumn,
												)
											}
										}}
									/>
									({masterColumn.columnLabel}){" "}
									{masterColumn.columnName}
								</div>
							)
						})}
						<div className={"flex flex-row gap-2"}>
							<button
								className={"border border-gray-200 p-2"}
								onClick={() => {
									selectAllMasterColumns()
								}}
							>
								Select All
							</button>
							<button
								className={"border border-gray-200 p-2"}
								onClick={() => {
									deselectAllMasterColumns()
								}}
							>
								Deselect All
							</button>
						</div>
					</div>
				</div>
				<div
					className={
						"flex flex-grow flex-col items-start justify-between gap-4 rounded border border-gray-200 p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Input Columns
					</h5>
					<div
						className={
							"flex flex-grow flex-col items-start justify-between gap-2"
						}
					>
						{inputColumns.map((inputColumn) => {
							const columnCheckedInArr =
								inputSelectedColumns.find((selectedCol) => {
									return (
										selectedCol.columnLabel ===
										inputColumn.columnLabel
									)
								})

							const columnIsIndex =
								inputColumn.columnLabel ===
								inputIndex?.columnLabel

							const columnChecked =
								!!columnCheckedInArr || columnIsIndex

							return (
								<div
									className={
										"flex flex-row items-center justify-between gap-1"
									}
									key={inputColumn.columnLabel}
								>
									<input
										value={inputColumn.columnLabel}
										type={"checkbox"}
										checked={columnChecked}
										disabled={columnIsIndex}
										onChange={(e) => {
											if (e.target.checked) {
												onInputColumnSelect(inputColumn)
											} else {
												onInputColumnDeselect(
													inputColumn,
												)
											}
										}}
									/>
									({inputColumn.columnLabel}){" "}
									{inputColumn.columnName}
								</div>
							)
						})}
						<div className={"flex flex-row gap-2"}>
							<button
								className={"border border-gray-200 p-2"}
								onClick={() => {
									selectAllInputColumns()
								}}
							>
								Select All
							</button>
							<button
								className={"border border-gray-200 p-2"}
								onClick={() => {
									deselectAllInputColumns()
								}}
							>
								Deselect All
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
