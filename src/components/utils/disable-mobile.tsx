import type { ReactNode } from "react"

type DisableMobileProps = {
	children: ReactNode
}

export function DisableMobile(props: DisableMobileProps) {
	return (
		<>
			<div className="hidden lg:block">
				{props.children}
			</div>
			<div className="lg:hidden flex min-h-svh min-w-svw items-center justify-center">
				<p className="text-center text-2xl font-bold">
					Excello is not supported on mobile devices.
				</p>
			</div>
		</>
	)
}