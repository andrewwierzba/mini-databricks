"use client"

import { useState } from "react"

import { ApplicationShell } from "@/components/ui/patterns/application-shell"
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel"
import { Graph } from "@/components/ui/patterns/graph"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { SidebarCollapseIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

export default function Page() {
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
        <ApplicationShell>
            <div className="flex flex-1 flex-col h-full">
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
                </div>
        </ApplicationShell>
    )
}
