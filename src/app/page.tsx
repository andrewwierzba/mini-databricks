"use client"

import { useState } from "react"
import { Navigation } from "@/components/ui/patterns/navigation"
import { Assistant } from "@/components/ui/patterns/assistant"

export default function Home() {
	const [showAssistant, setShowAssistant] = useState(false)

	return (
		<div className="flex flex-col h-full">
			<Navigation onOpenAssistant={() => setShowAssistant(true)} />
			<div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full">
				<div className="p-6 w-full">
					<h1 className="text-4xl font-medium text-center w-full">Mini Databricks</h1>
				</div>
				{showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
			</div>
		</div>
	)
}
