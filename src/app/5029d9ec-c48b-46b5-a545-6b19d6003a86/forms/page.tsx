"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import Form1 from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/form-1";
import Form2 from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/form-2";

interface Props {
    orientation?: "horizontal" | "vertical";
}

export default function Page({ orientation = "horizontal" }: Props) {
	const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 });
	
	const cursorId = useSearchParams().get("id");

	return (
		<ResizablePanelGroup
			className="bg-background"
			direction={orientation}
			onMouseLeave={() => setCursor((prev) => ({ ...prev, visible: false }))}
			onMouseMove={(e) => setCursor({ visible: true, x: e.clientX, y: e.clientY })}
		>
			<ResizablePanel className="p-6" defaultSize={50}>
				<Form1 />
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel className="p-6" defaultSize={50}>
				<Form2 orientation={orientation} />
			</ResizablePanel>

			{cursorId && cursor.visible && (
				<div
					className="bg-primary fixed pointer-events-none px-2 py-0.5 rounded-full text-primary-foreground text-xs z-100"
					style={{ left: cursor.x + 12, top: cursor.y + 12 }}
				>
					{cursorId}
				</div>
			)}
		</ResizablePanelGroup>
	);
}
