"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
	Background,
	BackgroundVariant,
	Controls,
	Edge,
	Node,
	NodeTypes,
	Panel,
	useEdgesState,
	useNodesState,
	useReactFlow,
	ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import {
	ChevronDown,
	LayoutGrid,
	Loader2,
	MessageCircle,
	PaperclipIcon,
	SendIcon,
	SparklesIcon,
	SquareIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	User,
	XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

// =============================================================================
// CHAT PANEL VARIATIONS
// =============================================================================

// Version 1: Minimal Chat Panel
function MinimalChatPanel() {
	return (
		<div className="bg-white border border-gray-200 flex flex-col h-[320px] rounded-sm w-[280px]">
			<div className="border-b border-gray-200 flex items-center gap-2 p-3">
				<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm w-6">
					<SparklesIcon className="h-3 text-blue-600 w-3" />
				</div>
				<span className="font-medium text-[12px]">AI Assistant</span>
			</div>

			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col gap-3">
					<div className="flex gap-2">
						<div className="bg-gray-100 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<User className="h-3 text-gray-600 w-3" />
						</div>
						<div className="bg-blue-600 p-2 rounded-sm text-[11px] text-white">
							How do I add a new task?
						</div>
					</div>
					<div className="flex gap-2">
						<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<SparklesIcon className="h-3 text-blue-600 w-3" />
						</div>
						<div className="bg-gray-100 p-2 rounded-sm text-[11px] text-gray-800">
							Click the + button on the canvas to add a new task node.
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 flex gap-2 p-3">
				<Input className="flex-1 h-8 text-[11px]" placeholder="Ask anything..." />
				<Button className="bg-blue-600 h-8 hover:bg-blue-700 w-8" size="icon">
					<SendIcon className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}

// Version 2: Full Featured Chat Panel
function FullFeaturedChatPanel() {
	return (
		<div className="bg-white border border-gray-200 flex flex-col h-[400px] rounded-sm w-[320px]">
			<div className="border-b border-gray-200 flex flex-col gap-2 p-3">
				<div className="flex items-center gap-2">
					<div className="bg-blue-100 flex h-7 items-center justify-center rounded-sm w-7">
						<SparklesIcon className="h-4 text-blue-600 w-4" />
					</div>
					<div className="flex flex-1 flex-col">
						<span className="font-semibold text-[12px]">AI Assistant</span>
						<span className="text-[10px] text-gray-500">Pipeline helper</span>
					</div>
				</div>

				<div className="flex gap-2">
					<Button className="h-7 text-[10px]" size="sm" variant="outline">
						Agent
						<ChevronDown className="h-3 ml-1 w-3" />
					</Button>
					<Select defaultValue="claude-sonnet-4.5">
						<SelectTrigger className="h-7 text-[10px] w-[120px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="claude-sonnet-4.5">Sonnet 4.5</SelectItem>
							<SelectItem value="claude-sonnet-4">Sonnet 4</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-wrap gap-1">
					<Badge className="font-normal gap-1 h-5 text-[9px]" variant="secondary">
						<PaperclipIcon className="h-2 w-2" />
						schema.json
						<XIcon className="cursor-pointer h-2 w-2" />
					</Badge>
					<Button className="h-5 text-[9px]" size="sm" variant="ghost">
						<PaperclipIcon className="h-2 mr-1 w-2" />
						Add
					</Button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row-reverse gap-2">
						<div className="bg-gray-200 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<User className="h-3 text-gray-600 w-3" />
						</div>
						<div className="bg-blue-600 max-w-[80%] p-2 rounded-sm text-[11px] text-white">
							Add a data quality check between tasks
						</div>
					</div>
					<div className="flex gap-2">
						<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<SparklesIcon className="h-3 text-blue-600 w-3" />
						</div>
						<div className="flex flex-col gap-2 max-w-[85%]">
							<div className="bg-gray-50 border border-gray-200 p-2 rounded-sm">
								<p className="font-medium mb-1 text-[10px] text-gray-700">Plan</p>
								<ul className="list-disc list-inside space-y-0.5 text-[10px] text-gray-600">
									<li>Create quality check notebook</li>
									<li>Add task to pipeline</li>
									<li>Validate configuration</li>
								</ul>
							</div>
							<div className="bg-gray-100 p-2 rounded-sm text-[11px] text-gray-800">
								I'll create a data quality check. Ready to proceed?
							</div>
							<div className="flex gap-1">
								<Button className="h-6 px-2 text-[9px]" size="sm" variant="outline">
									<XIcon className="h-2 mr-1 w-2" />
									Reject
								</Button>
								<Button className="bg-blue-600 h-6 hover:bg-blue-700 px-2 text-[9px]" size="sm">
									Accept
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 flex gap-2 p-3">
				<Input className="flex-1 h-8 text-[11px]" placeholder="Ask about your pipeline..." />
				<Button className="bg-blue-600 h-8 hover:bg-blue-700 w-8" size="icon">
					<SendIcon className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}

// Version 3: Compact Inline Chat
function CompactChatPanel() {
	return (
		<div className="bg-white border border-gray-200 flex flex-col h-[200px] rounded-sm w-[260px]">
			<div className="border-b border-gray-200 flex items-center gap-2 px-3 py-2">
				<SparklesIcon className="h-4 text-blue-600 w-4" />
				<span className="flex-1 font-medium text-[11px]">Quick Ask</span>
				<Badge className="h-4 text-[8px]" variant="secondary">Agent</Badge>
			</div>

			<div className="flex-1 overflow-y-auto p-2">
				<div className="flex flex-col gap-2">
					<div className="bg-blue-600 ml-auto p-1.5 rounded-sm text-[10px] text-white w-fit">
						What's the status?
					</div>
					<div className="bg-gray-100 p-1.5 rounded-sm text-[10px] text-gray-800 w-fit">
						All 4 tasks are healthy. Last run: 2 min ago.
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 flex gap-1.5 p-2">
				<Input className="flex-1 h-7 text-[10px]" placeholder="Quick question..." />
				<Button className="bg-blue-600 h-7 hover:bg-blue-700 w-7" size="icon">
					<SendIcon className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}

// Version 4: Streaming/Thinking State
function StreamingChatPanel() {
	return (
		<div className="bg-white border border-gray-200 flex flex-col h-[320px] rounded-sm w-[280px]">
			<div className="border-b border-gray-200 flex items-center gap-2 p-3">
				<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm w-6">
					<SparklesIcon className="animate-pulse h-3 text-blue-600 w-3" />
				</div>
				<span className="font-medium text-[12px]">AI Assistant</span>
				<Badge className="bg-blue-100 h-4 text-[8px] text-blue-700" variant="secondary">
					<Loader2 className="animate-spin h-2 mr-1 w-2" />
					Thinking
				</Badge>
			</div>

			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row-reverse gap-2">
						<div className="bg-gray-200 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<User className="h-3 text-gray-600 w-3" />
						</div>
						<div className="bg-blue-600 p-2 rounded-sm text-[11px] text-white">
							Optimize the pipeline for cost
						</div>
					</div>
					<div className="flex gap-2">
						<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<SparklesIcon className="animate-pulse h-3 text-blue-600 w-3" />
						</div>
						<div className="flex flex-col gap-2">
							<div className="bg-blue-50 border border-blue-200 p-2 rounded-sm">
								<div className="flex gap-1 items-center mb-1">
									<Loader2 className="animate-spin h-2 text-blue-700 w-2" />
									<span className="font-medium text-[9px] text-blue-700 uppercase">
										Analyzing pipeline...
									</span>
								</div>
								<p className="text-[10px] text-blue-800">
									Checking task configurations and identifying optimization opportunities...
								</p>
							</div>
							<div className="bg-gray-100 p-2 rounded-sm">
								<div className="flex gap-1">
									<div className="animate-pulse bg-gray-400 h-2 rounded w-full" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 flex gap-2 p-3">
				<Input className="flex-1 h-8 text-[11px]" disabled placeholder="Waiting for response..." />
				<Button className="bg-red-600 h-8 hover:bg-red-700 w-8" size="icon">
					<SquareIcon className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}

// Version 5: With Feedback Controls
function FeedbackChatPanel() {
	return (
		<div className="bg-white border border-gray-200 flex flex-col h-[340px] rounded-sm w-[280px]">
			<div className="border-b border-gray-200 flex items-center gap-2 p-3">
				<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm w-6">
					<SparklesIcon className="h-3 text-blue-600 w-3" />
				</div>
				<span className="font-medium text-[12px]">AI Assistant</span>
			</div>

			<div className="flex-1 overflow-y-auto p-3">
				<div className="flex flex-col gap-3">
					<div className="flex flex-row-reverse gap-2">
						<div className="bg-gray-200 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<User className="h-3 text-gray-600 w-3" />
						</div>
						<div className="bg-blue-600 p-2 rounded-sm text-[11px] text-white">
							Explain the Enrich task
						</div>
					</div>
					<div className="flex gap-2">
						<div className="bg-blue-100 flex h-6 items-center justify-center rounded-sm shrink-0 w-6">
							<SparklesIcon className="h-3 text-blue-600 w-3" />
						</div>
						<div className="flex flex-col gap-2 max-w-[85%]">
							<div className="bg-gray-100 p-2 rounded-sm text-[11px] text-gray-800">
								The Enrich task uses an LLM to extract firmographic attributes from customer data. It takes parsed records and outputs enriched profiles with confidence scores.
							</div>
							<div className="flex gap-1 items-center">
								<Button
									className="h-6 w-6"
									size="icon"
									variant="ghost"
								>
									<ThumbsUpIcon className="h-3 w-3" />
								</Button>
								<Button
									className="h-6 w-6"
									size="icon"
									variant="ghost"
								>
									<ThumbsDownIcon className="h-3 w-3" />
								</Button>
								<span className="ml-1 text-[9px] text-gray-400">Was this helpful?</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="border-t border-gray-200 flex gap-2 p-3">
				<Input className="flex-1 h-8 text-[11px]" placeholder="Ask a follow-up..." />
				<Button className="bg-blue-600 h-8 hover:bg-blue-700 w-8" size="icon">
					<SendIcon className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
}

// =============================================================================
// REACTFLOW NODE COMPONENTS
// =============================================================================

function ChatPanelNode({ data }: { data: { label: string; variant: string } }) {
	const renderPanel = () => {
		switch (data.variant) {
			case "minimal":
				return <MinimalChatPanel />;
			case "full":
				return <FullFeaturedChatPanel />;
			case "compact":
				return <CompactChatPanel />;
			case "streaming":
				return <StreamingChatPanel />;
			case "feedback":
				return <FeedbackChatPanel />;
			default:
				return <MinimalChatPanel />;
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="bg-gray-800 px-3 py-1.5 rounded-t-sm text-center text-white">
				<span className="font-medium text-[11px]">{data.label}</span>
			</div>
			{renderPanel()}
		</div>
	);
}

const nodeTypes: NodeTypes = {
	chatPanel: ChatPanelNode,
};

// =============================================================================
// ORGANIZED LAYOUT POSITIONS
// =============================================================================

const organizedPositions: Record<string, { x: number; y: number }> = {
	compact: { x: 750, y: 50 },
	feedback: { x: 380, y: 480 },
	full: { x: 380, y: 50 },
	minimal: { x: 50, y: 50 },
	streaming: { x: 50, y: 480 },
};

const initialNodes: Node[] = [
	{
		data: { label: "1. Minimal", variant: "minimal" },
		id: "minimal",
		position: { x: 50, y: 50 },
		type: "chatPanel",
	},
	{
		data: { label: "2. Full Featured", variant: "full" },
		id: "full",
		position: { x: 380, y: 50 },
		type: "chatPanel",
	},
	{
		data: { label: "3. Compact", variant: "compact" },
		id: "compact",
		position: { x: 750, y: 50 },
		type: "chatPanel",
	},
	{
		data: { label: "4. Streaming State", variant: "streaming" },
		id: "streaming",
		position: { x: 50, y: 480 },
		type: "chatPanel",
	},
	{
		data: { label: "5. With Feedback", variant: "feedback" },
		id: "feedback",
		position: { x: 380, y: 480 },
		type: "chatPanel",
	},
];

const initialEdges: Edge[] = [
	{ animated: true, id: "e1-2", source: "minimal", target: "full", type: "smoothstep" },
	{ animated: true, id: "e2-3", source: "full", target: "compact", type: "smoothstep" },
	{ animated: true, id: "e1-4", source: "minimal", target: "streaming", type: "smoothstep" },
	{ animated: true, id: "e4-5", source: "streaming", target: "feedback", type: "smoothstep" },
];

// =============================================================================
// MAIN PAGE
// =============================================================================

function Flow() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const { fitView } = useReactFlow();

	const handleCleanup = useCallback(() => {
		setNodes((nds) =>
			nds.map((node) => ({
				...node,
				position: organizedPositions[node.id] || node.position,
			}))
		);
		setTimeout(() => fitView({ padding: 0.1 }), 50);
	}, [setNodes, fitView]);

	return (
		<ReactFlow
			defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
			edges={edges}
			fitView
			nodes={nodes}
			nodeTypes={nodeTypes}
			onEdgesChange={onEdgesChange}
			onNodesChange={onNodesChange}
		>
			<Background
				color="#d1d5db"
				gap={20}
				size={1}
				variant={BackgroundVariant.Dots}
			/>
			<Controls showInteractive={false} />
			<Panel className="bg-white border border-gray-200 p-3 rounded-sm shadow-sm" position="top-left">
				<h1 className="font-semibold text-[14px]">AI Chat Panel Variations</h1>
				<p className="mt-1 text-[11px] text-gray-500">
					5 different patterns for AI chat interfaces
				</p>
				<Button
					className="h-7 mt-3 text-[11px] w-full"
					onClick={handleCleanup}
					size="sm"
					variant="outline"
				>
					<LayoutGrid className="h-3 mr-1.5 w-3" />
					Clean up layout
				</Button>
			</Panel>
		</ReactFlow>
	);
}

export default function Page() {
	return (
		<div className="bg-gray-100 h-screen w-full">
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>
		</div>
	);
}
