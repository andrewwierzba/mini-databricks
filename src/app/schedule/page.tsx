"use client"

import { useState } from "react"
import { FileEditor } from "@/components/ui/patterns/file-editor"
import { Navigation } from "@/components/ui/patterns/navigation"
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { Assistant } from "@/components/ui/patterns/assistant"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { SidebarCollapseIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

export default function Page() {
    const [showAssistant, setShowAssistant] = useState(false)
    const [showPanel, setShowPanel] = useState(true)

    const sections = [{
        label: "Section_001"
    }, {
        label: "Section_002"
    }, {
        label: "Section_003"
    }]

    return (
        <div className="flex flex-col h-full">
            <Navigation onOpenAssistant={() => setShowAssistant(true)} />
            <div className="bg-(--du-bois-color-background-primary) border-(--du-bois-color-border) border rounded-sm flex font-sans h-full overflow-hidden">
                <div className="flex flex-1">
                    <div aria-label="panel" className="flex-1">
                        <div className="bg-gray-50 h-1/2"></div>
                        <Panel side="bottom" />
                    </div>
                    { showPanel ? (
                        <Panel>
                            <PanelContent className="w-100">
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
