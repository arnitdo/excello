import { useEffect } from "react"

import type { Column } from "@/utils/types"

type IndexSelectProps = {
	masterColumns: Column[]
	inputColumns: Column[]
	masterIndex: Column | null
	inputIndex: Column | null
	onMasterIndexSelect: (indexColumn: Column) => void
	onInputIndexSelect: (indexColumn: Column) => void
}

export function IndexSelect(props: IndexSelectProps) {
	const {
		inputColumns,
		masterColumns,
		onInputIndexSelect,
		onMasterIndexSelect,
		inputIndex,
		masterIndex,
	} = props

	useEffect(() => {
		if (masterIndex === null) {
			if (masterColumns.length) {
				const masterColumnWithIdName = masterColumns.find(
					(masterColumn) => {
						return masterColumn.columnName
							.toLowerCase()
							.includes("id")
					},
				)
				if (masterColumnWithIdName) {
					onMasterIndexSelect(masterColumnWithIdName)
				} else {
					onMasterIndexSelect(masterColumns[0])
				}
			}
		}
		if (inputIndex === null) {
			if (inputColumns.length) {
				const inputColumnWithIdName = inputColumns.find(
					(inputColumn) => {
						return inputColumn.columnName
							.toLowerCase()
							.includes("id")
					},
				)
				if (inputColumnWithIdName) {
					onInputIndexSelect(inputColumnWithIdName)
				} else {
					onInputIndexSelect(inputColumns[0])
				}
			}
		}
	}, [masterIndex, inputIndex])

	return (
		<div
			className={"flex w-full flex-col items-start justify-between gap-4"}
		>
			<h2 className={"text-2xl font-bold"}>3. Select Index</h2>
			<p className={"ml-4"}>
				Select the master index that is unique for each row, then select
				the input index which can be non-unique
			</p>
			<div
				className={
					"flex w-full flex-row items-start justify-between gap-2"
				}
			>
				<div
					className={
						"flex min-h-16 flex-grow flex-row items-center justify-between rounded border border-black p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Master Index
					</h5>
					<select
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							const targetColumn = masterColumns.find(
								(colObj) => {
									return colObj.columnLabel === e.target.value
								},
							)
							if (targetColumn) {
								onMasterIndexSelect(targetColumn)
							}
						}}
						value={masterIndex?.columnLabel}
					>
						{masterColumns.map((masterColumn) => (
							<option
								key={masterColumn.columnLabel}
								value={masterColumn.columnLabel}
							>
								({masterColumn.columnLabel}){" "}
								{masterColumn.columnName}
							</option>
						))}
					</select>
				</div>
				<div
					className={
						"flex min-h-16 flex-grow flex-row items-center justify-between rounded border border-black p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Input Index
					</h5>
					<select
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							const targetColumn = inputColumns.find((colObj) => {
								return colObj.columnLabel === e.target.value
							})
							if (targetColumn) {
								onInputIndexSelect(targetColumn)
							}
						}}
						value={inputIndex?.columnLabel}
					>
						{inputColumns.map((inputColumn) => (
							<option
								key={inputColumn.columnLabel}
								value={inputColumn.columnLabel}
							>
								({inputColumn.columnLabel}){" "}
								{inputColumn.columnName}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}
