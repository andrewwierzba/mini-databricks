"use client"

import { useState, useRef } from "react"

import { cn } from "@/lib/utils"

import { Navigation } from "@/components/ui/patterns/navigation"
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel"
import { Assistant } from "@/components/ui/patterns/assistant"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { CheckCircleIcon, GridDashIcon, SidebarCollapseIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

function Graph({ className }: { className?: string }) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedSteps, setSelectedSteps] = useState<Set<number>>(new Set())
    const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
    
    const graphRef = useRef<HTMLDivElement>(null)
    const stepRef = useRef<HTMLDivElement>(null)

    const stepId = 0

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
            const graphRect = graphRef.current.getBoundingClientRect()
            const stepRect = stepRef.current.getBoundingClientRect()
            
            const relativeStepRect = new DOMRect(
                stepRect.height,
                stepRect.left - graphRect.left,
                stepRect.top - graphRect.top,
                stepRect.width
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
        
        const height = Math.abs(selectionBox.endY - selectionBox.startY)
        const left = Math.min(selectionBox.startX, selectionBox.endX)
        const top = Math.min(selectionBox.startY, selectionBox.endY)
        const width = Math.abs(selectionBox.endX - selectionBox.startX)

        return {
            height: `${height}px`,
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
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

export default function Page() {
    const [showAssistant, setShowAssistant] = useState(false)
    const [showPanel, setShowPanel] = useState(true)

    const sections = [{
        content: 
            <Typography>
                <Text>No details available.</Text>
            </Typography>,
        label: "Section_001"
    }, {
        content: 
            <div>
                <Typography>
                    <Text>No triggers configured.</Text>
                </Typography>
                <Button
                    aria-label="cancel"
                    className="rounded-sm text-[13px] h-6 mt-2 px-2"
                    size="sm"
                    variant="outline"
                >
                    Add trigger
                </Button>
            </div>,
        label: "Triggers"
    }, {
        content: 
            <Typography>
                <Text>No parameters configured.</Text>
            </Typography>,
        label: "Parameters"
    }, {
        content: 
            <Typography>
                <Text>No compute configured.</Text>
            </Typography>,
        label: "Compute"
    }, {
        content: 
            <div>
                <Typography>
                    <Text>No notifications configured.</Text>
                </Typography>
                <Button
                    aria-label="cancel"
                    className="rounded-sm text-[13px] h-6 mt-2 px-2"
                    size="sm"
                    variant="outline"
                >
                    Add notification
                </Button>
            </div>,
        label: "Notifications"
    }]

    return (
        <div className="flex flex-col h-full">
            <Navigation onOpenAssistant={() => setShowAssistant(true)} />
            <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex flex-col font-sans h-full overflow-hidden">
                <div className="border-b border-(--du-bois-color-border) flex items-center gap-2 p-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 rounded-sm h-6 w-6"></div>
                        <span className="text-sm font-semibold">analytics.hourly_orders</span>
                    </div>
                    <div className="flex flex-1 justify-end">
						<Button
							aria-label="run-query"
							className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 px-3"
							size="sm"
						>
							Run ⌘ ⏎
						</Button>
					</div>
                </div>
                <div className="flex flex-1">
                    <div aria-label="panel" className="flex flex-1 flex-col">
                        <Graph className="flex-1" />
                        <Panel
                            defaultSize={256}
                            minSize={64}
                            side="bottom"
                        >
                            <PanelContent className="relative">
                                <div aria-label="controls" className="border-t border-(--du-bois-color-border) bottom-0 flex gap-2 left-0 px-2 py-1 absolute right-0">
                                    <div className="flex flex-1 gap-1 justify-end">
                                        <Button
                                            aria-label="cancel"
                                            className="rounded-sm text-[13px] h-8 px-3"
                                            size="sm"
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            aria-label="save"
                                            className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 px-3"
                                            size="sm"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </PanelContent>
                        </Panel>
                    </div>
                    { showPanel ? (
                        <Panel defaultSize={384} minSize={256}>
                            <PanelContent className="w-full">
                                <div className="items-center flex gap-2 p-2">
                                    <div className="w-full">
                                        <Typography>
                                            <Text bold>Sidebar</Text>
                                        </Typography>
                                    </div>
                                    <PanelTrigger onClick={() => showPanel && setShowPanel(false)}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    aria-label="Collapse panel"
                                                    className="h-6 rounded-sm w-6"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <SidebarCollapseIcon
                                                        className="scale-x-[-1]"
                                                        onPointerEnterCapture={undefined}
                                                        onPointerLeaveCapture={undefined}
                                                        style={{
                                                            color: "var(--du-bois-color-text-secondary)"
                                                        }}
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <Text style={{ color: "var(--du-bois-text-white)" }}>
                                                    Collapse panel
                                                </Text>
                                            </TooltipContent>
                                        </Tooltip>
                                    </PanelTrigger>
                                </div>

                                {sections.map((section, index) => (
                                    <div
                                        aria-label="panel-section"
                                        className={`${index > 0 ? 'border-t' : ''} border-(--du-bois-color-border) p-2 w-full`}
                                        key={`panel-section-${index}`}
                                    >
                                    <Typography>
                                        <Text bold>{section.label}</Text>
                                    </Typography>
                                    {section.content}
                                    </div>
                                ))}
                            </PanelContent>
                        </Panel>
                    ) : (
                        <div className="border-l border-(--du-bois-color-border) p-2">
                            <Tooltip>
                                <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        aria-label="open-panel"
                                        className="rounded-sm h-6 w-6"
                                        onClick={() => setShowPanel(true)}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <SidebarCollapseIcon
                                            onPointerEnterCapture={undefined}
                                            onPointerLeaveCapture={undefined}
                                            style={{
                                                color: 'var(--du-bois-color-text-secondary)'
                                            }}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <Typography>
                                        <Text style={{ color: 'var(--du-bois-text-white)' }}>
                                            Expand side panel
                                        </Text>
                                    </Typography>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
                {showAssistant && <Assistant onClose={() => setShowAssistant(false)} />}
            </div>
        </div>
    )
}
