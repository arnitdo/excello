import type { Dispatch, SetStateAction } from "react"

type SheetSelectProps = {
	masterSheetOptions: string[]
	onMasterSheetSelect: (masterSheetName: string) => void
	inputSheetOptions: string[]
	onInputSheetSelect: (inputSheetName: string) => void
	masterHeaderOffset: number
	setMasterHeaderOffset: Dispatch<SetStateAction<number>>
	inputHeaderOffset: number
	setInputHeaderOffset: Dispatch<SetStateAction<number>>
}

export function SheetSelect(props: SheetSelectProps) {
	const {
		inputSheetOptions,
		masterSheetOptions,
		onInputSheetSelect,
		onMasterSheetSelect,
		masterHeaderOffset,
		setMasterHeaderOffset,
		inputHeaderOffset,
		setInputHeaderOffset,
	} = props

	return (
		<div
			className={"flex w-full flex-col items-start justify-between gap-4"}
		>
			<h2 className={"text-2xl font-bold"}>2. Select Sheets</h2>
			<p className={"ml-4"}>
				Select the master record containing all data, then the input
				sheet. The first rows of both sheet must have the column headers
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
						Select Master Sheet
					</h5>
					<select
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							onMasterSheetSelect(e.target.value)
						}}
					>
						{masterSheetOptions.map((sheetName) => (
							<option key={sheetName} value={sheetName}>
								{sheetName}
							</option>
						))}
					</select>
					Header Offset{" "}
					<input
						className={"border border-black"}
						type={"number"}
						min={0}
						value={masterHeaderOffset}
						onChange={(e) => {
							setMasterHeaderOffset(
								Number.parseInt(e.target.value || "0"),
							)
						}}
					></input>{" "}
					Rows
				</div>
				<div
					className={
						"flex min-h-16 flex-grow flex-row items-center justify-between rounded border border-black p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Input Sheet
					</h5>
					<select
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							onInputSheetSelect(e.target.value)
						}}
					>
						{inputSheetOptions.map((sheetName) => (
							<option key={sheetName} value={sheetName}>
								{sheetName}
							</option>
						))}
					</select>
					Header Offset{" "}
					<input
						className={"border border-black"}
						type={"number"}
						min={0}
						value={inputHeaderOffset}
						onChange={(e) => {
							setInputHeaderOffset(
								Number.parseInt(e.target.value || "0"),
							)
						}}
					></input>{" "}
				</div>
			</div>
		</div>
	)
}
