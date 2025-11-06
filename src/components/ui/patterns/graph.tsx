"use client"

import { useState, useRef } from "react"

import { cn } from "@/lib/utils"

import { CheckCircleIcon, GridDashIcon, ZoomInIcon, ZoomOutIcon, ZoomToFitIcon } from "@databricks/design-system"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface Edge {
    id: string
    source: number
    target: number
}

interface Node {
    icon?: React.ReactNode
    id: number
    name: string
    x: number
    y: number
}

type EdgePath = 
    | { type: 'line'; x1: number; y1: number; x2: number; y2: number }
    | { type: 'curve'; d: string }
    | null

export function Graph({ className }: { className?: string }) {
    const graphRef = useRef<HTMLDivElement>(null)
    const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map())
    const [zoom, setZoom] = useState(1)

    const edges: Edge[] = [
        { id: "e0-1", source: 0, target: 1 },
        { id: "e0-2", source: 0, target: 2 },
        { id: "e1-3", source: 1, target: 3 },
        { id: "e2-3", source: 2, target: 3 },
    ]

    const nodes: Node[] = [
        { id: 0, name: "Step 001", x: 50, y: 50 },
        { id: 1, name: "Step 002", x: 340, y: 50 },
        { id: 2, name: "Step 003", x: 340, y: 217 },
        { id: 3, name: "Step 004", x: 630, y: 50 },
    ]

    const nodeHeight = 117
    const nodeWidth = 240

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 2))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5))
    }

    const handleZoomReset = () => {
        setZoom(1)
    }

    const getEdgePath = (edge: Edge): EdgePath => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        
        if (!sourceNode || !targetNode) return null

        const x1 = sourceNode.x + nodeWidth
        const y1 = sourceNode.y + nodeHeight / 2
        const x2 = targetNode.x
        const y2 = targetNode.y + nodeHeight / 2

        if (Math.abs(y1 - y2) < 5) {
            return { type: 'line', x1, y1, x2, y2 }
        }

        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        
        const cx1 = x1 + Math.min(dx * 0.25, 50)
        const cy1 = y1 + (y2 > y1 ? dy * 0.3 : -dy * 0.3)
        const cx2 = x2 - Math.min(dx * 0.25, 50)
        const cy2 = y2 - (y2 > y1 ? dy * 0.3 : -dy * 0.3)

        return {
            type: 'curve',
            d: `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
        }
    }

    return (
        <div
            aria-label="graph" 
            className={cn("bg-gray-50 overflow-hidden p-2 relative", className)}
            ref={graphRef}
        >
            <div className="bottom-4 flex flex-col gap-2 absolute right-4 z-10">
                <Button
                    className="bg-white h-8 w-8"
                    disabled={zoom === 1}
                    onClick={handleZoomReset}
                    size="icon"
                    variant="outline"
                >
                    <ZoomToFitIcon
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Button>
                <Button
                    className="bg-white h-8 w-8"
                    disabled={zoom >= 2}
                    onClick={handleZoomIn}
                    size="icon"
                    variant="outline"
                >
                    <ZoomInIcon
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Button>
                <Button
                    className="bg-white h-8 w-8"
                    disabled={zoom <= 0.5}
                    onClick={handleZoomOut}
                    size="icon"
                    variant="outline"
                >
                    <ZoomOutIcon
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    />
                </Button>
            </div>

            <div
                className="inset-0 absolute"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-out'
                }}
            >
                <svg className="h-full inset-0 pointer-events-none absolute w-full z-0">
                    <defs>
                        <pattern
                            height="12"
                            id="dot-grid"
                            patternUnits="userSpaceOnUse"
                            width="12"
                        >
                            <circle
                                className="fill-gray-200"
                                cx="1"
                                cy="1"
                                r="1"
                            />
                        </pattern>
                    </defs>

                    <rect
                        fill="url(#dot-grid)"
                        height="100%"
                        width="100%"
                    />

                    {edges.map((edge) => {
                        const path = getEdgePath(edge)
                        if (!path) return null

                        if (path.type === 'line') {
                            return (
                                <line
                                    key={edge.id}
                                    x1={path.x1}
                                    y1={path.y1}
                                    x2={path.x2}
                                    y2={path.y2}
                                    className="stroke-gray-400"
                                    strokeWidth="1"
                                />
                            )
                        }

                        return (
                            <path
                                key={edge.id}
                                d={path.d}
                                fill="none"
                                className="stroke-gray-400"
                                strokeWidth="1"
                            />
                        )
                    })}
                </svg>

                {nodes.map((node) => (
                    <div
                        aria-label="graph-step"
                        className="bg-white rounded-sm shadow-xs absolute w-[240px] z-1"
                        key={node.id}
                        ref={(el) => {
                            if (el) nodeRefs.current.set(node.id, el)
                        }}
                        style={{
                            left: `${node.x}px`,
                            top: `${node.y}px`,
                        }}
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
                                {node.name}
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
                ))}
            </div>
        </div>
    )
}