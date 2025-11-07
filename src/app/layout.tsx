import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const ebGaramond = EB_Garamond({
	variable: "--font-eb-garamond",
	subsets: ["latin"],
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mini Databricks",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${ebGaramond.variable} ${geistSans.variable} ${geistMono.variable} flex flex-col antialiased h-screen`}>
				{children}
			</body>
		</html>
	);
}