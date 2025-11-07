"use client";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";

export default function Home() {
	return (
		<ApplicationShell>
			<div className="p-6">
				<h1 className="text-4xl font-medium text-center w-full">Mini Databricks</h1>
			</div>
		</ApplicationShell>
	)
}
