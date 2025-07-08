type FileSelectProps = {
	onMasterRecordChange: (masterRecord: File) => void
	onInputRecordChange: (inputRecord: File) => void
}

export function FileSelect({
	onInputRecordChange,
	onMasterRecordChange,
}: FileSelectProps) {
	return (
		<div
			className={"flex w-full flex-col items-start justify-between gap-4"}
		>
			<h2 className={"text-2xl font-bold"}>1. Select Files</h2>
			<p className={"ml-4"}>
				Select the master record containing all data, then the input
				sheet. Note: Only .ods, .csv, and .xlsx files are supported
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
						Select Master Record
					</h5>
					<input
						type={"file"}
						accept={".ods,.csv,.xlsx"}
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							const fileList = e.target.files
							if (fileList === null || fileList.length === 0) {
								return
							}
							const selectedFile = fileList[0]
							onMasterRecordChange(selectedFile)
						}}
					></input>
				</div>
				<div
					className={
						"flex min-h-16 flex-grow flex-row items-center justify-between rounded border border-black p-2"
					}
				>
					<h5 className={"text-lg font-semibold"}>
						Select Input Record
					</h5>
					<input
						type={"file"}
						accept={".ods,.csv,.xlsx"}
						className={
							"max-w-[32ch] rounded border border-black p-1"
						}
						onChange={(e) => {
							const fileList = e.target.files
							if (fileList === null || fileList.length === 0) {
								return
							}
							const selectedFile = fileList[0]
							onInputRecordChange(selectedFile)
						}}
					></input>
				</div>
			</div>
		</div>
	)
}
