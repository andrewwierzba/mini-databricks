"use client"

import { useCallback, useMemo } from "react"
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Handle,
    Node,
    NodeTypes,
    BackgroundVariant,
    Position,
} from "reactflow"
import "reactflow/dist/style.css"

import { cn } from "@/lib/utils"

import { CheckCircleIcon, GridDashIcon } from "@databricks/design-system"

import { Separator } from "@/components/ui/separator"

// Custom Node Component
interface StepNodeData {
    content?: React.ReactNode;
    label: string;
    showSource?: boolean;
    showTarget?: boolean;
}

function StepNode({ data }: { data: StepNodeData }) {
    return (
        <div
            aria-label="graph-step"
            className="bg-white relative rounded-sm shadow-xs w-[240px]"
        >
            {data.showTarget !== false && <Handle className="!bg-gray-300 !border-none !h-2 !w-2" position={Position.Left} type="target" />}
            {data.showSource !== false && <Handle className="!bg-gray-300 !border-none !h-2 !w-2" position={Position.Right} type="source" />}
            <div className="items-center flex gap-2 p-2">
                <div aria-label="step-icon" className="bg-gray-100 rounded-sm flex h-6 p-1 w-6">
                    <GridDashIcon
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        style={{
                            color: "var(--du-bois-color-text-secondary)",
                        }}
                    />
                </div>
                <span aria-label="step-name" className="text-sm font-semibold flex-1 truncate">
                    {data.label}
                </span>
                <div aria-label="step-status" className="flex h-6 items-center justify-center w-6">
                    <CheckCircleIcon
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        style={{
                            color: "var(--du-bois-color-validation-success)",
                        }}
                    />
                </div>
            </div>
            <Separator className="bg-gray-200" />
            <div aria-label="" className="min-w-0 overflow-hidden p-2">
                {data?.content ? (
                    data.content
                ) : (
                    <div className="bg-gray-50 border border-gray-200 border-dashed h-[60px] rounded" />
                )}
            </div>
        </div>
    )
}

const nodeTypes: NodeTypes = {
    step: StepNode,
}

export function Graph({ className }: { className?: string }) {
    const initialNodes: Node[] = useMemo(() => [
        { 
            id: "0", 
            type: "step",
            position: { x: 50, y: 50 },
            data: { 
                content: 
                    <>
                        <span className="bg-neutral-200 block rounded-sm px-1.5 truncate">/pipelines/bronze/customer_activity_ingest</span>
                    </>,
                label: "Ingest customers",
                showTarget: false,
            }
        },
        { 
            id: "1", 
            type: "step",
            position: { x: 340, y: 50 },
            data: { label: "Transform customers" }
        },
        { 
            id: "2", 
            type: "step",
            position: { x: 630, y: 50 },
            data: { label: "Aggregate" }
        },
        { 
            id: "3", 
            type: "step",
            position: { x: 920, y: 50 },
            data: { label: "Quality check", showSource: false }
        },
    ], [])

    const initialEdges: Edge[] = useMemo(() => [
        { id: "e0-1", source: "0", target: "1", type: "smoothstep" },
        { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
        { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
    ], [])

    return (
        <div
            aria-label="directed-acyclic-graph" 
            className={cn("bg-gray-50", className)}
        >
            <ReactFlow
                edges={initialEdges}
                fitView
                fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
                nodes={initialNodes}
                nodeTypes={nodeTypes}
            >
                <Background 
                    color="#e5e7eb"
                    gap={12} 
                    size={1}
                    variant={BackgroundVariant.Dots} 
                />
                <Controls 
                    showFitView={true}
                    showInteractive={false}
                    showZoom={true}
                />
            </ReactFlow>
        </div>
    )
}