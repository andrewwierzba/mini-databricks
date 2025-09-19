"use client"

import { useState } from "react"
import { Navigation } from "@/components/ui/patterns/navigation"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

export default function Home() {
	const [showAssistant, setShowAssistant] = useState(true)

	return (
		<div className="flex flex-col h-full">
			<Navigation onOpenAssistant={() => setShowAssistant(true)} />
			<div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full">
				<Workspace />
				<div className="w-full">
					Mini Databricks
				</div>
				{showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
			</div>
		</div>
	);
}
