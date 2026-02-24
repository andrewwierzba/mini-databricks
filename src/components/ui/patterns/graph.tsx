"use client"

import { useCallback, useMemo } from "react"
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    NodeTypes,
    BackgroundVariant,
    Panel,
    useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"

import { cn } from "@/lib/utils"

import { CheckCircleIcon, GridDashIcon } from "@databricks/design-system"

import { Separator } from "@/components/ui/separator"

// Custom Node Component
function StepNode({ data }: { data: { label: string } }) {
    return (
        <div
            aria-label="graph-step"
            className="bg-white rounded-sm shadow-xs w-[240px]"
                    >
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
                        <div aria-label="" className="p-2">
                            <div className="bg-gray-50 border border-gray-200 border-dashed h-[60px] rounded" />
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
            data: { label: "Step 001" }
        },
        { 
            id: "1", 
            type: "step",
            position: { x: 340, y: 50 },
            data: { label: "Step 002" }
        },
        { 
            id: "2", 
            type: "step",
            position: { x: 340, y: 217 },
            data: { label: "Step 003" }
        },
        { 
            id: "3", 
            type: "step",
            position: { x: 630, y: 50 },
            data: { label: "Step 004" }
        },
    ], [])

    const initialEdges: Edge[] = useMemo(() => [
        { id: "e0-1", source: "0", target: "1", type: "smoothstep" },
        { id: "e0-2", source: "0", target: "2", type: "smoothstep" },
        { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
        { id: "e2-3", source: "2", target: "3", type: "smoothstep" },
    ], [])

    return (
        <div
            aria-label="directed-acyclic-graph" 
            className={cn("bg-gray-50", className)}
        >
            <ReactFlow
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                edges={initialEdges}
                fitView
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