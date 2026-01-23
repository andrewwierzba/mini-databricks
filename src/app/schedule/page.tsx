"use client"

import { useState } from "react"

import { ApplicationShell } from "@/components/ui/patterns/application-shell"
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel"
import { Graph } from "@/components/ui/patterns/graph"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/mini-ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs,  TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { ChevronDownIcon, PlayIcon, SidebarCollapseIcon, StarIcon } from "@databricks/design-system"

interface TriggerConditionData {
    label: string;
    operator?: "AND" | "OR";
    type: string;
    value: string;
}

interface TriggerConditionProps extends TriggerConditionData {
    onDelete: () => void;
    onOperatorChange?: (operator: "AND" | "OR") => void;
}

function TriggerCondition({ label, operator, value, onDelete, onOperatorChange }: TriggerConditionProps) {
    return (
        <div
            aria-label="trigger-condition"
            className="flex flex-col gap-2"
        >
            <div className="items-center flex gap-2 justify-between">
                <div className="items-center flex gap-2">
                    {operator && onOperatorChange && (
                        <Select onValueChange={(value) => onOperatorChange(value as "AND" | "OR")} value={operator}>
                            <SelectTrigger className="w-[80px] h-7 text-sm" size="sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-(--gray-200)">
                                <SelectItem className="focus:bg-[var(--blue-600)]/8 hover:bg-[var(--blue-600)]/8" value="AND">AND</SelectItem>
                                <SelectItem className="focus:bg-[var(--blue-600)]/8 hover:bg-[var(--blue-600)]/8" value="OR">OR</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <Button
                    onClick={onDelete}
                    size="sm"
                    variant="outline"
                >
                    Delete
                </Button>
            </div>
            <div aria-label="trigger-condition-editor" className="border border-(--gray-200) rounded-sm shadow-xs">
                <div className="flex relative">
                    <Tabs className="gap-0 w-full" defaultValue="sql">
                        <TabsList className="m-1">
                            <TabsTrigger value="sql">SQL</TabsTrigger>
                            <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>
                        <TabsContent className="border-t border-(--gray-200) flex gap-4 px-3 py-1" value="sql">
                            <div
                                aria-label="editor-line-count"
                                className="text-(--gray-600) text-[12px] text-right"
                            >
                                <div>1</div>
                            </div>
                            <textarea
                                aria-label="editor-value"
                                className="font-mono text-[12px] h-full min-h-0 outline-none resize-none whitespace-pre w-full"
                                value={value}
                            />
                        </TabsContent>
                        <TabsContent className="border-t border-(--gray-200) px-3 py-1" value="python">
                            <div className="font-mono text-[12px]">{value}</div>
                        </TabsContent>
                    </Tabs>
                    <Button
                        className="gap-1 mt-0.5 absolute right-1 top-1"
                        size="sm"
                        variant="outline"
                    >
                        <PlayIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        Run test
                    </Button>
                </div>
                <div className="border-t border-(--gray-200) text-(--gray-600) text-xs px-3 py-1.5">
                    Click <span className="bg-gray-200 rounded-sm px-1 py-0.5">Run test</span> to execute query.
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    const [showPanel, setShowPanel] = useState(true);
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [triggerConditions, setTriggerConditions] = useState<TriggerConditionData[]>([]);

    const sections = [{
        content: 
            <span>No details available.</span>,
        label: "Section_001"
    }, {
        content: 
            <div>
                <div>No triggers configured.</div>
                <Button
                    aria-label="cancel"
                    className="rounded-sm text-[13px] h-6 mt-2 px-2"
                    onClick={() => setShowTriggerDialog(true)}
                    size="sm"
                    variant="outline"
                >
                    Add trigger
                </Button>
            </div>,
        label: "Triggers"
    }, {
        content: 
            <span>No parameters configured.</span>,
        label: "Parameters"
    }, {
        content: 
            <span>No compute configured.</span>,
        label: "Compute"
    }, {
        content: 
            <div>
                <div>No notifications configured.</div>
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
                                            <span style={{ fontWeight: "bold" }}>Sidebar</span>
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
                                        className={`${index > 0 ? 'border-t' : ''} border-(--du-bois-color-border) text-[13px] p-2 w-full`}
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
            <Dialog onOpenChange={setShowTriggerDialog} open={showTriggerDialog}>
                <DialogContent className="sm:max-w-[600px] border-(--du-bois-color-border) flex flex-col max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>New trigger</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <FieldSet>
                        <FieldGroup className="gap-4">
                            <Field className="items-start" orientation="horizontal">
                                <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="trigger-type">Trigger type</FieldLabel>
                                <Select defaultValue="cron" >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a trigger type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="continuous">Continuous</SelectItem>
                                        <SelectItem value="cron">Scheduled</SelectItem>
                                        <SelectItem value="file-arrival">File arrival</SelectItem>
                                        <SelectItem value="model-update">Model update</SelectItem>
                                        <SelectItem value="table-update">Table update</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field className="items-start relative" orientation="horizontal">
                                <FieldLabel className="left mt-[6px] min-w-[144px] absolute" htmlFor="schedule-type">Schedule type</FieldLabel>
                                <Tabs className="gap-4 w-full" defaultValue="interval">
                                    <TabsList className="ml-[calc(144px+8px)] w-[calc(100%-144px-8px)]">
                                        <TabsTrigger value="interval">Interval</TabsTrigger>
                                        <TabsTrigger value="cron">Cron</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="interval">
                                        <FieldSet>
                                            <FieldGroup className="gap-4">
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="run-every">Run every</FieldLabel>
                                                    <Select defaultValue="1">
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a frequency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">1</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="interval">Interval</FieldLabel>
                                                    <Select defaultValue="day">
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select an interval" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="minute">Minute</SelectItem>
                                                            <SelectItem value="hour">Hour</SelectItem>
                                                            <SelectItem value="day">Day</SelectItem>
                                                            <SelectItem value="week">Week</SelectItem>
                                                            <SelectItem value="month">Month</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            </FieldGroup>
                                        </FieldSet>
                                    </TabsContent>
                                    <TabsContent value="cron">Cron</TabsContent>
                                </Tabs>
                            </Field>
                            <Separator />
                            <div className="items-center flex gap-2 justify-between">
                                <div className="text-sm font-medium">Trigger conditions</div>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => setTriggerConditions([
                                            ...triggerConditions, 
                                            { 
                                                label: `Condtion ${triggerConditions.length + 1}`,
                                                operator: triggerConditions.length > 0 ? "AND" : undefined,
                                                type: "sql", 
                                                value: "SELECT COUNT(*) > 0 FROM sales WHERE date = CURRENT_DATE()" 
                                            }
                                        ])}
                                        variant="outline"
                                    >
                                        Add trigger condition
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="outline">
                                                <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="border-(--gray-200) px-0 py-1">
                                            <DropdownMenuItem className="rounded-none focus:bg-[var(--blue-600)]/8 hover:bg-[var(--blue-600)]/8">
                                                Browse trigger conditions
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-none focus:bg-[var(--blue-600)]/8 hover:bg-[var(--blue-600)]/8">
                                                New trigger condition
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </ButtonGroup>
                            </div>
                            <div className="flex flex-col gap-4">
                                {triggerConditions.map((condition, index) => (
                                    <TriggerCondition 
                                        key={index} 
                                        {...condition} 
                                        onDelete={() => setTriggerConditions(triggerConditions.filter((_, i) => i !== index))}
                                        onOperatorChange={(operator) => {
                                            const updated = [...triggerConditions];
                                            updated[index] = { ...updated[index], operator };
                                            setTriggerConditions(updated);
                                        }}
                                    />
                                ))}
                            </div>
                        </FieldGroup>
                    </FieldSet>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowTriggerDialog(false)}
                            className="rounded-sm text-[13px] h-8 px-3"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 px-3"
                            onClick={() => setShowTriggerDialog(false)}
                        >
                            Add trigger
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ApplicationShell>
    )
}
