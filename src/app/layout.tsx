import "./globals.css"
import { DisableMobile } from "@/components/utils/disable-mobile"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Excello by Arnitdo",
	description:
		"Manipulate spreadsheets on the fly. Runs fully in your browser, no data sent to servers",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-svh w-svw bg-black text-white antialiased`}
			>
				<DisableMobile>{children}</DisableMobile>
			</body>
		</html>
	)
}
