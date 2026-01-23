"use client";

import { useMemo, useState } from "react";
import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge,
    NodeTypes,
    BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

import { InfoIcon } from "lucide-react";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { Button } from "@/components/mini-ui/button";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { CheckCircleIcon, GridDashIcon, PauseIcon, PlayIcon, SidebarCollapseIcon, StarIcon } from "@databricks/design-system";
import { SlackIcon } from "@/assets/icons/slack-icon";

import { TriggerConfig } from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/forms/trigger-form";
import TriggerDialog from "@/app/216bec6d-e892-413c-a70c-15c977db4dbb/patterns/trigger-dialog";

interface NotificationProps {
    failure?: boolean;
    id: string;
    start?: boolean;
    success?: boolean;
    type: "email" | "slack" | "webhook";
    value?: string;
};

interface ParameterProps {
    id: string;
    value: string;
};

interface TagProps {
   id: string;
   value: string;
};

interface Props {
    author: string;
    description?: string;
    id: string;
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
    tags?: TagProps[];
    triggers?: TriggerConfig[];
};

// Custom Node Component for inline graph
function StepNode({ data }: { data: { label: string } }) {
    return (
        <div
            aria-label="graph-step"
            className="bg-white border border-gray-200 rounded-sm shadow-xs w-[240px]"
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
    );
}

const nodeTypes: NodeTypes = {
    step: StepNode,
};

export default function Page({ 
    author = "andrew.wierzba@databricks.com",
    notifications = [{ failure: false, id: "notification1", start: false, success: true, type: "slack", value: "slack://channel/123" }],
    parameters = [{ id: "param1", value: "value1" }],
    tags = [{ id: "tag1", value: "value1" }],
}: Props) {
    const [resetTriggerDialog, setResetTriggerDialog] = useState(0);
    const [showPanel, setShowPanel] = useState(true);
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [trigger, setTrigger] = useState<TriggerConfig | null>(null);

    const graphNodes: Node[] = useMemo(() => [
        { 
            id: "step-1", 
            type: "step",
            position: { x: 0, y: 0 },
            data: { label: "Label" }
        },
    ], []);

    const graphEdges: Edge[] = useMemo(() => [], []);

    const sections = [{
        content: 
            <div className="flex flex-col gap-2">
                <div aria-label="id" className="flex gap-2">
                    <span className="max-w-24 w-full">Job ID</span>
                    <span className="truncate flex-1 min-w-0">216bec6d-e892-413c-a70c-15c977db4dbb</span>
                </div>
                <div aria-label="author" className="flex gap-2">
                    <span className="max-w-24 w-full">Creator</span>
                    <span className="truncate flex-1 min-w-0">{author}</span>
                </div>
                <div aria-label="run-as" className="flex gap-2">
                    <span className="max-w-24 w-full">Run as</span>
                    <span className="truncate flex-1 min-w-0">{author}</span>
                </div>
                <div aria-label="description" className="items-center flex gap-2">
                    <span className="max-w-24 w-full">Description</span>
                    <Button
                        className="rounded-sm text-[13px] h-6 px-2"
                        size="sm"
                        variant="outline"
                    >
                        Add description
                    </Button>
                </div>
                <div aria-label="lineage" className="flex gap-2">
                    <span className="max-w-24 w-full">Lineage</span>
                    <span className="truncate flex-1 min-w-0">No lineage available.</span>
                </div>
                <div aria-label="performance-optimized" className="flex gap-2">
                    <span className="max-w-24 w-full">Performance optimized</span>
                    <Switch className="data-[state=checked]:bg-[var(--blue-600)]" onCheckedChange={() => {}} />
                </div>
            </div>,
        label: "Details"
    }, {
        content: 
            <div className="flex flex-col gap-2">
                {trigger ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <span className="font-bold capitalize">{trigger.type} {trigger.status || "(Paused)"}</span>
                        {trigger.type === "schedule" && trigger.scheduleMode === "simple" && (
                            <span className="truncate">Every {trigger.interval} {trigger.timeUnit}</span>
                        )}
                        {trigger.type === "schedule" && trigger.scheduleMode === "advanced" && (
                            <span className="truncate">
                                {trigger.useCronExpression && trigger.cronExpression 
                                    ? `Cron: ${trigger.cronExpression}`
                                    : `Every ${trigger.timeUnit} at ${String(trigger.hour ?? 0).padStart(2, "0")}:${String(trigger.minute ?? 0).padStart(2, "0")} (${trigger.timezone})`
                                }
                            </span>
                        )}
                        {trigger.conditions && trigger.conditions.length > 0 && (
                            <div className="flex gap-2">
                                <span className="text-gray-600 max-w-24 truncate w-full">Trigger conditions</span>
                                <div className="items-start flex flex-wrap gap-2">
                                    {(() => {
                                        const typeCounts = trigger.conditions.reduce((acc, condition) => {
                                            const type = condition.type === "sql" ? "SQL" : "Python";
                                            acc[type] = (acc[type] || 0) + 1;
                                            return acc;
                                        }, {} as Record<string, number>);
                                        
                                        return Object.entries(typeCounts).map(([type, count]) => (
                                            <span className="bg-(--gray-100) rounded-sm px-1.5" key={type}>
                                                {type}: {count}
                                            </span>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <span>No triggers configured.</span>
                )}

                <div className="flex gap-2">
                    <Button
                        aria-label="add-trigger"
                        className="rounded-sm text-[13px] h-6 px-2 w-fit"
                        onClick={() => setShowTriggerDialog(true)}
                        size="sm"
                        variant="outline"
                    >
                        {trigger ? "Edit trigger" : "Add trigger"}
                    </Button>
                    {trigger ? (
                        <>
                            {trigger.status ? (
                                <Button
                                    aria-label="pause-trigger"
                                    className="rounded-sm text-[13px] gap-1 h-6 px-2 w-fit"
                                    onClick={() => setTrigger({ ...trigger, status: false })}
                                    size="sm"
                                    variant="outline"
                                >
                                    <PauseIcon
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                        style={{ color: "var(--gray-500)" }}
                                    />
                                    Pause
                                </Button>
                            ) : (
                                <Button
                                    aria-label="resume-trigger"
                                    className="rounded-sm text-[13px] gap-1 h-6 px-2 w-fit"
                                    onClick={() => setTrigger({ ...trigger, status: true })}
                                    size="sm"
                                    variant="outline"
                                >
                                    <PlayIcon
                                        onPointerEnterCapture={undefined}
                                        onPointerLeaveCapture={undefined}
                                        style={{ color: "var(--gray-500)" }}
                                    />
                                    Resume
                                </Button>
                            )}
                            <Button
                                aria-label="delete-trigger"
                                className="rounded-sm text-[13px] h-6 px-2 w-fit"
                                onClick={() => {
                                    setResetTriggerDialog((prev) => prev + 1);
                                    setTrigger(null);
                                }}
                                size="sm"
                                variant="outline"
                            >
                                Delete
                            </Button>
                        </>
                    ) : null}
                </div>
            </div>,
        label: "Schedules & triggers"
    }, {
        content: 
            parameters && parameters.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {parameters.map((parameter) => (
                            <span className="bg-(--gray-100) rounded-sm px-1.5" key={parameter.id}>{parameter.id}: {parameter.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-parameters"
                        className="rounded-sm text-[13px] h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {parameters.length > 0 ? "Edit parameters" : "Add parameters"}
                    </Button>
                </>
            ) : <span>No parameters configured.</span>,
        label: "Parameters"
    }, {
        content: 
            <span>No compute configured.</span>,
        label: "Compute"
    }, {
        content: 
            tags && tags.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span className="bg-(--gray-100) rounded-sm px-1.5" key={tag.id}>{tag.id}: {tag.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-tags"
                        className="rounded-sm text-[13px] h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {tags.length > 0 ? "Edit tags" : "Add tags"}
                    </Button>
                </>
            ) : <span>No tags configured.</span>,
        label: "Tags"
    }, {
        content: 
            notifications && notifications.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {notifications.map((notification) => (
                            <span className="items-center flex gap-2" key={notification.id}>
                                {notification.type === "slack" && <SlackIcon height={16} width={16} />}
                                {notification.value}: {notification.failure && "Failure"} {notification.start && "Start"} {notification.success && "Success"}
                            </span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-tags"
                        className="rounded-sm text-[13px] h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {tags.length > 0 ? "Edit notifications" : "Add notifications"}
                    </Button>
                </>
            ) : <span>No notifications configured.</span>,
        label: "Notifications"
    }]

    return (
        <ApplicationShell>
            <div className="flex flex-1 flex-col h-full">
                <Breadcrumb className="p-2">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-(--blue-600)" href="/schedule">
                                Lakeflow
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>›</BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-(--blue-600)" href="/schedule">
                                Jobs & pipelines
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="border-b border-(--du-bois-color-border) flex items-center gap-2 p-2">
                    <div className="items-center flex gap-2">
                        <div className="bg-gray-100 rounded-sm h-6 w-6"></div>
                        <span className="text-sm font-semibold">analytics.hourly_orders</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="text-(--du-bois-text-secondary) h-6 w-6"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <StarIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Add to favorites</span>
                            </TooltipContent>
                        </Tooltip>
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
                <div className="flex flex-1 overflow-hidden">
                    <div aria-label="panel" className="flex flex-1 flex-col">
                        {/* Graph */}
                        <div
                            aria-label="graph" 
                            className="bg-white-800 flex-1 overflow-hidden"
                        >
                            <ReactFlow
                                nodes={graphNodes}
                                edges={graphEdges}
                                nodeTypes={nodeTypes}
                                fitView
                                fitViewOptions={{ minZoom: 1, maxZoom: 1.5 }}
                            >
                                <Background 
                                    variant={BackgroundVariant.Dots} 
                                    gap={12} 
                                    size={1}
                                    color="#e5e7eb"
                                />
                                <Controls 
                                    showZoom={true}
                                    showFitView={true}
                                    showInteractive={false}
                                />
                            </ReactFlow>
                        </div>

                        {/* Panel */}
                        <Panel
                            defaultSize={256}
                            minSize={64}
                            side="bottom"
                        >
                            <PanelContent className="relative">
                                <div className="p-4">
                                    <Alert className="bg-(--gray-100) border-(--gray-200)">
                                        <InfoIcon style={{ color: "var(--gray-500)" }} />
                                        <AlertTitle>No task selected</AlertTitle>
                                        <AlertDescription>
                                            Choose a task from the graph to edit its properties.
                                        </AlertDescription>
                                    </Alert>
                                </div>
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
                            <PanelContent className="h-full overflow-y-scroll w-full">
                                <div className="items-center flex gap-2 p-2">
                                    <div className="w-full">
                                        <span aria-label="panel-title" className="font-bold" />
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
                                                <span style={{ color: "var(--du-bois-text-white)" }}>
                                                    Collapse panel
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </PanelTrigger>
                                </div>

                                {sections.map((section, index) => (
                                    <div
                                        aria-label="panel-section"
                                        className={`${index > 0 ? 'border-t' : ''} border-(--du-bois-color-border) flex flex-col text-[13px] gap-2 p-4 w-full`}
                                        key={`panel-section-${index}`}
                                    >
                                        <div className="font-bold">{section.label}</div>
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
                                    <span style={{ color: 'var(--du-bois-text-white)' }}>
                                        Expand side panel
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            {/* Trigger Dialog */}
            <TriggerDialog
                onOpenChange={setShowTriggerDialog}
                onSubmit={(config) => {
                    setTrigger(config);
                    setShowTriggerDialog(false);
                }}
                open={showTriggerDialog}
                resetTrigger={resetTriggerDialog}
            />
        </ApplicationShell>
    )
}
