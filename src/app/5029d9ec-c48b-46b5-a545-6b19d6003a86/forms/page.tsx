"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CheckCircle2Icon } from "lucide-react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import Form1 from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/form-1";
import Form2 from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/form-2";

interface Props {
    orientation?: "horizontal" | "vertical";
}

interface CursorState {
	visible: boolean;
	x: number;
	y: number;
}

interface TimerState {
	completed: boolean;
	elapsed: number;
	running: boolean;
}

// Stopwatch component
function Stopwatch({ color, completed, elapsed, label }: { color: string; completed: boolean; elapsed: number; label: string }) {
	const minutes = Math.floor(elapsed / 60000);
	const seconds = Math.floor((elapsed % 60000) / 1000);
	const centiseconds = Math.floor((elapsed % 1000) / 10);

	return (
		<div
			className="items-center flex gap-2 px-3 py-1.5 rounded-lg"
			style={{ backgroundColor: completed ? "#22c55e" : color }}
		>
			{completed && <CheckCircle2Icon className="size-4 text-white" />}
			<span className="font-mono font-semibold text-white text-sm">
				{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}.{String(centiseconds).padStart(2, "0")}
			</span>
			<span className="text-white/80 text-xs">{label}</span>
		</div>
	);
}

// Cursor component for reuse
function AgentCursor({ color, label, x, y }: { color: string; label: string; x: number; y: number }) {
	return (
		<div
			className="fixed pointer-events-none transition-all duration-75 ease-out z-100"
			style={{ left: x, top: y }}
		>
			<svg
				className="absolute left-0 top-0"
				fill="none"
				height="24"
				viewBox="0 0 24 24"
				width="24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
					fill={color}
					stroke="#fff"
					strokeWidth="1.5"
				/>
			</svg>
			<div
				className="absolute px-2 py-0.5 rounded-full text-white text-xs whitespace-nowrap"
				style={{ left: 16, top: 18, backgroundColor: color }}
			>
				{label}
			</div>
		</div>
	);
}

function PageContent({ orientation = "horizontal" }: Props) {
	const [cursor, setCursor] = useState<CursorState>({ visible: false, x: 0, y: 0 });
	const [cursor1, setCursor1] = useState<CursorState>({ visible: false, x: 0, y: 0 });
	const [cursor2, setCursor2] = useState<CursorState>({ visible: false, x: 0, y: 0 });
	const [timer1, setTimer1] = useState<TimerState>({ completed: false, elapsed: 0, running: false });
	const [timer2, setTimer2] = useState<TimerState>({ completed: false, elapsed: 0, running: false });
	const timer1Start = useRef<number | null>(null);
	const timer2Start = useRef<number | null>(null);

	const searchParams = useSearchParams();
	const cursorId = searchParams.get("id");
	const dualMode = searchParams.get("dual") === "true";

	// Timer update loop
	useEffect(() => {
		const interval = setInterval(() => {
			if (timer1.running && timer1Start.current !== null) {
				setTimer1((prev) => ({ ...prev, elapsed: Date.now() - timer1Start.current! }));
			}
			if (timer2.running && timer2Start.current !== null) {
				setTimer2((prev) => ({ ...prev, elapsed: Date.now() - timer2Start.current! }));
			}
		}, 10);
		return () => clearInterval(interval);
	}, [timer1.running, timer2.running]);

	// Timer control functions
	const startTimer1 = useCallback(() => {
		timer1Start.current = Date.now();
		setTimer1({ completed: false, elapsed: 0, running: true });
	}, []);

	const stopTimer1 = useCallback(() => {
		setTimer1((prev) => ({ ...prev, completed: true, running: false }));
	}, []);

	const startTimer2 = useCallback(() => {
		timer2Start.current = Date.now();
		setTimer2({ completed: false, elapsed: 0, running: true });
	}, []);

	const stopTimer2 = useCallback(() => {
		setTimer2((prev) => ({ ...prev, completed: true, running: false }));
	}, []);

	// Expose cursor and timer setters to window for Playwright control
	useEffect(() => {
		if (dualMode) {
			(window as unknown as Record<string, unknown>).setCursor1 = (x: number, y: number, visible = true) => {
				setCursor1({ x, y, visible });
			};
			(window as unknown as Record<string, unknown>).setCursor2 = (x: number, y: number, visible = true) => {
				setCursor2({ x, y, visible });
			};
			(window as unknown as Record<string, unknown>).startTimer1 = startTimer1;
			(window as unknown as Record<string, unknown>).stopTimer1 = stopTimer1;
			(window as unknown as Record<string, unknown>).startTimer2 = startTimer2;
			(window as unknown as Record<string, unknown>).stopTimer2 = stopTimer2;
		}
		return () => {
			delete (window as unknown as Record<string, unknown>).setCursor1;
			delete (window as unknown as Record<string, unknown>).setCursor2;
			delete (window as unknown as Record<string, unknown>).startTimer1;
			delete (window as unknown as Record<string, unknown>).stopTimer1;
			delete (window as unknown as Record<string, unknown>).startTimer2;
			delete (window as unknown as Record<string, unknown>).stopTimer2;
		};
	}, [dualMode, startTimer1, startTimer2, stopTimer1, stopTimer2]);

	return (
		<ResizablePanelGroup
			className="bg-background"
			direction={orientation}
			onMouseLeave={() => setCursor((prev) => ({ ...prev, visible: false }))}
			onMouseMove={(e) => setCursor({ visible: true, x: e.clientX, y: e.clientY })}
		>
			<ResizablePanel className="p-6 relative" defaultSize={50}>
				<Form1 />
				{dualMode && (timer1.running || timer1.completed) && (
					<div className="absolute bottom-4 right-4">
						<Stopwatch
							color="#dc2626"
							completed={timer1.completed}
							elapsed={timer1.elapsed}
							label="Agent 1"
						/>
					</div>
				)}
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel className="p-6 relative" defaultSize={50}>
				<Form2 orientation={orientation} />
				{dualMode && (timer2.running || timer2.completed) && (
					<div className="absolute bottom-4 right-4">
						<Stopwatch
							color="#2563eb"
							completed={timer2.completed}
							elapsed={timer2.elapsed}
							label="Agent 2"
						/>
					</div>
				)}
			</ResizablePanel>

			{/* Single cursor mode */}
			{cursorId && !dualMode && cursor.visible && (
				<AgentCursor color="#000" label={cursorId} x={cursor.x} y={cursor.y} />
			)}

			{/* Dual cursor mode */}
			{dualMode && cursor1.visible && (
				<AgentCursor color="#dc2626" label="Agent 1" x={cursor1.x} y={cursor1.y} />
			)}
			{dualMode && cursor2.visible && (
				<AgentCursor color="#2563eb" label="Agent 2" x={cursor2.x} y={cursor2.y} />
			)}
		</ResizablePanelGroup>
	);
}

export default function Page({ orientation = "horizontal" }: Props) {
	return (
		<Suspense fallback={null}>
			<PageContent orientation={orientation} />
		</Suspense>
	);
}
