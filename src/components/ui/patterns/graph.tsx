"use client"

import { useState, useRef } from "react"

import { cn } from "@/lib/utils"

import { GridDashIcon, CheckCircleIcon } from "@databricks/design-system"

import { Separator } from "@/components/ui/separator"

export function Graph({ className }: { className?: string }) {
    const [selectedSteps, setSelectedSteps] = useState<Set<number>>(new Set())
    const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const graphRef = useRef<HTMLDivElement>(null)
    const stepRef = useRef<HTMLDivElement>(null)

    const stepId = 0 // For now, we have one step with id 0

    // Helper function to check if a rectangle intersects with the selection box
    const checkIntersection = (rect: DOMRect, box: { startX: number; startY: number; endX: number; endY: number }) => {
        const boxLeft = Math.min(box.startX, box.endX)
        const boxRight = Math.max(box.startX, box.endX)
        const boxTop = Math.min(box.startY, box.endY)
        const boxBottom = Math.max(box.startY, box.endY)

        return !(
            rect.right < boxLeft ||
            rect.left > boxRight ||
            rect.bottom < boxTop ||
            rect.top > boxBottom
        )
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        // Only start selection if clicking on the graph background, not on a step
        if (e.target === graphRef.current) {
            setIsDragging(true)
            setSelectedSteps(new Set())
            const rect = graphRef.current.getBoundingClientRect()
            setSelectionBox({
                startX: e.clientX - rect.left,
                startY: e.clientY - rect.top,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && selectionBox && graphRef.current) {
            const rect = graphRef.current.getBoundingClientRect()
            setSelectionBox({
                ...selectionBox,
                endX: e.clientX - rect.left,
                endY: e.clientY - rect.top,
            })
        }
    }

    const handleMouseUp = () => {
        if (isDragging && selectionBox && graphRef.current && stepRef.current) {
            // Check if the step intersects with the selection box
            const graphRect = graphRef.current.getBoundingClientRect()
            const stepRect = stepRef.current.getBoundingClientRect()
            
            // Convert step rect to graph-relative coordinates
            const relativeStepRect = new DOMRect(
                stepRect.left - graphRect.left,
                stepRect.top - graphRect.top,
                stepRect.width,
                stepRect.height
            )

            const newSelectedSteps = new Set<number>()
            if (checkIntersection(relativeStepRect, selectionBox)) {
                newSelectedSteps.add(stepId)
            }

            setSelectedSteps(newSelectedSteps)
        }

        setIsDragging(false)
        setSelectionBox(null)
    }

    const handleStepClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedSteps(new Set([stepId]))
    }

    // Calculate selection box dimensions for rendering
    const getSelectionBoxStyle = () => {
        if (!selectionBox) return {}
        
        const left = Math.min(selectionBox.startX, selectionBox.endX)
        const top = Math.min(selectionBox.startY, selectionBox.endY)
        const width = Math.abs(selectionBox.endX - selectionBox.startX)
        const height = Math.abs(selectionBox.endY - selectionBox.startY)

        return {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
        }
    }

    return (
        <div
            aria-label="graph" 
            className={cn("bg-gray-50 overflow-hidden p-2 relative", className)}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={graphRef}
        >
            <div
                aria-label="graph-step"
                className="bg-white rounded-sm shadow-xs inline-block w-[300px]"
                onClick={handleStepClick}
                ref={stepRef}
                style={{
                    left: "50%",
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
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
                    <span aria-label="step-name" className="text-sm font-semibold w-full">
                        Step 001
                    </span>
                    <div aria-label="step-status" className="flex h-6 p-1 w-6">
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
                    <div className="bg-gray-50 border border-gray-200 border-dashed h-[100px]" />
                </div>

                <div
                    className={cn(
                        "border rounded-sm bottom-0 left-0 absolute right-0 top-0",
                        selectedSteps.has(stepId) ? "border-(--du-bois-blue-600) border-2" : "border-gray-200"
                    )}
                />
            </div>

            {selectionBox && (
                <div
                    className="border-(--du-bois-blue-600) border-1 bg-(--du-bois-blue-600)/4 pointer-events-none absolute"
                    style={getSelectionBoxStyle()}
                />
            )}
        </div>
    )
}