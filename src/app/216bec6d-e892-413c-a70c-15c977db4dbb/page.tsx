"use client";

import { useState, useEffect } from "react";

import { InfoIcon } from "lucide-react";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { Button } from "@/components/mini-ui/button";

import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Tabs,  TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { CheckIcon, ChevronDownIcon, PauseIcon, PlayIcon, SidebarCollapseIcon, StarIcon, TrashIcon } from "@databricks/design-system";
import { SlackIcon } from "@/assets/icons/slack-icon";

/* Schedule Props */

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

interface TriggerConditionProps {
    id: string;
    label?: string;
    operator: "and" | "or";
    type: "sql" | "python";
    value: string;
};

interface TriggerConditionPropsExtended extends TriggerConditionProps {
    onDelete: () => void;
    onOperatorChange?: (operator: "AND" | "OR") => void;
};

interface TriggerProps {
    active: boolean;
    conditions?: TriggerConditionProps[];
    id: string;
    label?: string;
    type: "continuous" | "scheduled" | "file-arrival" | "model-update" | "table-update";
    recurrence?: {
        expression?: string;
        interval?: number;
        intervalUnit?: "minute" | "hour" | "day" | "week" | "month";
        timezone: string;
    };
};

interface ScheduleProps {
    author: string;
    description?: string;
    id: string;
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
    tags?: TagProps[];
    triggers?: TriggerProps[];
};

function TriggerCondition({
    label,
    operator,
    value,
    onDelete,
    onOperatorChange 
}: TriggerConditionPropsExtended) {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<{ rows: number,value: boolean } | null>(null);

    useEffect(() => {
        if (isRunning) {
            const timer = setTimeout(() => {
                setResult({ rows: (Math.floor(Math.random() * 1000) + 1), value: (Math.random() >= 0.5) });
                setIsRunning(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isRunning]);

    return (
        <div
            aria-label="trigger-condition"
            className="shadow-xs flex flex-col gap-2"
        >
            <div className="items-center flex gap-2 justify-between">
                <div className="items-center flex gap-2">
                    {operator && onOperatorChange && (
                        <Select onValueChange={(value) => onOperatorChange(value as "AND" | "OR")} value={operator}>
                            <SelectTrigger className="text-sm h-6 px-2 w-auto">
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
            </div>
            <div aria-label="trigger-condition-editor" className="border border-(--gray-200) rounded-sm shadow-xs">
                <div className="flex relative">
                    <Tabs className="gap-0 w-full" defaultValue="sql">
                        <div className="flex items-center gap-2 justify-between pr-1.5">
                            <TabsList className="bg-transparent rounded-sm h-6 m-1 p-0">
                                <TabsTrigger
                                    className="border-r-0 border-(--gray-200) rounded-sm rounded-r-none data-[state=active]:bg-(--blue-600)/8 data-[state=active]:border-(--blue-600) data-[state=active]:border-r-1 data-[state=active]:text-(--blue-800)"
                                    disabled={isRunning}
                                    value="sql"
                                >
                                        SQL
                                    </TabsTrigger>
                                <TabsTrigger
                                    className="border-l-0 border-(--gray-200) rounded-sm rounded-l-none data-[state=active]:bg-(--blue-600)/8 data-[state=active]:border-(--blue-600) data-[state=active]:border-l-1 data-[state=active]:text-(--blue-800)"
                                    disabled={isRunning}
                                    value="python"
                                >
                                    Python
                                </TabsTrigger>
                            </TabsList>
                            <Button
                                className="rounded-sm border-none h-6 w-6"
                                onClick={onDelete}
                                size="sm"
                                variant="outline"
                            >
                                <TrashIcon
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                    style={{ color: "var(--gray-500)" }}
                                />
                            </Button>
                        </div>
                        <TabsContent className="border-t border-(--gray-200) flex gap-4 px-3 py-1" value="sql">
                            <div
                                aria-label="editor-line-count"
                                className="text-(--gray-500) text-[13px] text-right"
                            >
                                <div>1</div>
                            </div>
                            <textarea
                                aria-label="editor-value"
                                className="font-mono text-[13px] h-full min-h-0 outline-none resize-none whitespace-pre w-full"
                                value={value}
                            />
                        </TabsContent>
                        <TabsContent className="border-t border-(--gray-200) flex gap-4 px-3 py-1" value="python">
                            <div
                                aria-label="editor-line-count"
                                className="text-(--gray-500) text-[13px] text-right"
                            >
                                <div>1</div>
                            </div>
                            <textarea
                                aria-label="editor-value"
                                className="font-mono text-[13px] h-full min-h-0 outline-none resize-none whitespace-pre w-full"
                                value={value}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <div className="items-center border-t border-(--gray-200) text-(--gray-500) flex gap-2 justify-between text-xs pl-3 pr-1.5 py-1.5">
                    <span>
                        {result && result.value !== null ? (
                            result.value ? (
                                <>Returned <span className="bg-green-100 rounded-sm text-green-600 px-1 py-0.5">true</span>, <span className="font-medium">{result.rows} row{result.rows !== 1 ? 's' : ''}</span></>
                            ) : (
                                <>Returned <span className="bg-red-100 rounded-sm text-red-600 px-1 py-0.5">false</span>, <span className="font-medium">0 rows</span></>
                            )
                        ) : (
                            <>
                                Click <span className="bg-gray-100 rounded-sm px-1 py-0.5">Run test</span> to evaluate condition.
                            </>
                        )}
                    </span>
                    <Button
                        className="rounded-sm gap-1 h-6"
                        disabled={isRunning}
                        onClick={() => setIsRunning(true)}
                        size="sm"
                        variant="outline"
                    >
                        {isRunning ?
                            <>
                                <Spinner />
                                <span>Running...</span>
                            </> : 
                            <>
                                <PlayIcon
                                    onPointerEnterCapture={undefined}
                                    onPointerLeaveCapture={undefined}
                                    style={{ color: "var(--gray-500)" }}
                                />
                                <span>Run test</span>
                            </>
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Page({ 
    author = "andrew.wierzba@databricks.com",
    notifications = [{ failure: false, id: "notification1", start: false, success: true, type: "slack", value: "slack://channel/123" }],
    parameters = [{ id: "param1", value: "value1" }],
    tags = [{ id: "tag1", value: "value1" }],
}: ScheduleProps) {
    const [form, setForm] = useState({
        active: true,
        cronSyntax: false,
        expression: null as string | null,
        interval: 1,
        intervalUnit: "day",
        minutes: 0,
        hours: 0,
        timezone: "UTC+00:00",
        type: "scheduled",
    });

    const [showPanel, setShowPanel] = useState(true);
    const [showTriggerDialog, setShowTriggerDialog] = useState(false);
    const [trigger, setTrigger] = useState<TriggerProps | null>(null);
    const [triggerConditions, setTriggerConditions] = useState<TriggerConditionProps[]>([]);

    const generateCronExpression = () => {
        const { interval, intervalUnit, minutes, hours } = form;
        switch (intervalUnit) {
            case "minute":
                return `*/${interval} * * * *`;
            case "hour":
                return `${minutes} */${interval} * * *`;
            case "day":
                return `${minutes} ${hours} * * *`;
            case "week":
                return `${minutes} ${hours} * * 0`;
            case "month":
                return `${minutes} ${hours} 1 * *`;
            default:
                return `${minutes} ${hours} * * *`;
        }
    };

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
                {trigger && trigger.recurrence ? (
                    <div className="flex flex-col gap-2 mt-2">
                        <span className="font-bold capitalize">{trigger.type}</span>
                        <span className="truncate">Every {trigger.recurrence?.interval} {trigger.recurrence?.intervalUnit} ({trigger.recurrence?.timezone})</span>
                        {trigger.conditions && trigger.conditions.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <span className="font-bold capitalize">Conditions</span>
                                {trigger.conditions.map((condition) => (
                                    <div key={condition.id} className="items-center flex gap-2">
                                        <span className="bg-(--gray-100) rounded-sm px-1.5">{condition.type.toUpperCase()}</span>
                                        <span className="font-mono text-[12px] truncate">{condition.value}</span>
                                    </div>
                                ))}
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
                    {trigger && trigger.recurrence ? (
                        <>
                            {trigger.active ? (
                                <Button
                                    aria-label="pause-trigger"
                                    className="rounded-sm text-[13px] gap-1 h-6 px-2 w-fit"
                                    onClick={() => setTrigger({ ...trigger, active: false } as TriggerProps)}
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
                                    onClick={() => setTrigger({ ...trigger, active: true } as TriggerProps)}
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
                                onClick={() => setTrigger(null)}
                                size="sm"
                                variant="outline"
                            >
                                Delete
                            </Button>
                        </>
                     ) : null}
                 </div>
            </div>,
        label: "Triggers"
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
                            className="bg-white-800 flex-1 overflow-hidden p-2 relative"
                        >
                            <div
                                className="inset-0 absolute"
                            >
                                {/* Grid */}
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
                                </svg>

                                {/* Step */}
                                <div
                                    aria-label="graph-step"
                                    className="bg-white border border-(--gray-200) rounded-sm shadow-xs left-1/2 absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] z-1"
                                >
                                    <div className="items-center flex gap-2 p-2">
                                        <div aria-label="step-icon" className="bg-gray-100 rounded-sm flex h-6 p-1 w-6">
                                            {/* Step Icon */}
                                        </div>
                                        <span aria-label="step-name" className="text-sm font-semibold flex-1 truncate">
                                            Label
                                        </span>
                                        <div aria-label="step-status" className="flex h-6 items-center justify-center w-6">
                                            {/* Step Status Icon */}
                                        </div>
                                    </div>
                                    <Separator className="bg-gray-200" />
                                    <div aria-label="" className="p-2">
                                        <div className="bg-gray-50 border border-gray-200 border-dashed h-[60px] rounded" />
                                    </div>
                                </div>
                            </div>
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
            <Dialog onOpenChange={setShowTriggerDialog} open={showTriggerDialog}>
                <DialogContent className="sm:max-w-[600px] border-(--du-bois-color-border) flex flex-col max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>New trigger</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                        <FieldSet>
                        <FieldGroup className="gap-4">
                            <Field className="items-start" orientation="horizontal">
                                <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="trigger-status">
                                    Active
                                </FieldLabel>
                                <Switch 
                                    checked={form.active}
                                    id="trigger-status"
                                    className="data-[state=checked]:bg-[var(--blue-600)]"
                                    onCheckedChange={(checked) => setForm({ ...form, active: checked as TriggerProps["active"] })}
                                />
                            </Field>
                            <Field className="items-start" orientation="horizontal">
                                <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="trigger-type">
                                    Trigger type
                                </FieldLabel>
                                <Select onValueChange={(value) => setForm({ ...form, type: value as TriggerProps["type"]})} value={form.type}>
                                    <SelectTrigger className="w-full" id="trigger-type" >
                                        <SelectValue placeholder="Select a trigger type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="continuous">Continuous</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="file-arrival">File arrival</SelectItem>
                                        <SelectItem value="model-update">Model update</SelectItem>
                                        <SelectItem value="table-update">Table update</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field className="items-start relative" orientation="horizontal">
                                <FieldLabel className="left mt-[6px] min-w-[144px] absolute" htmlFor="schedule-type">
                                    Schedule type
                                </FieldLabel>
                                <Tabs className="gap-4 w-full" defaultValue="simple">
                                    <TabsList className="ml-[calc(144px+8px)] w-[calc(100%-144px-8px)]">
                                        <TabsTrigger value="simple">
                                            Simple
                                        </TabsTrigger>
                                        <TabsTrigger value="advanced">
                                            Advanced
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Simple */}
                                    <TabsContent value="simple">
                                        <FieldSet>
                                            <FieldGroup className="gap-4">
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="run-every">
                                                        Run every
                                                    </FieldLabel>
                                                    <Select defaultValue={form.interval.toString()} onValueChange={(value) => setForm({ ...form, interval: parseInt(value) as number })}>
                                                        <SelectTrigger className="w-full" id="run-every">
                                                            <SelectValue placeholder="Select a frequency" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 30 }, (_, index) => (
                                                                <SelectItem key={index} value={index.toString()}>{index}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="interval-unit">
                                                        Interval
                                                    </FieldLabel>
                                                    <Select defaultValue={form.intervalUnit} onValueChange={(value) => setForm({ ...form, intervalUnit: value as "minute" | "hour" | "day" | "week" | "month" })}>
                                                        <SelectTrigger className="w-full" id="interval-unit">
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

                                    {/* Advanced */}
                                    <TabsContent value="advanced">
                                        <FieldSet>
                                            <FieldGroup className="gap-4">
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="timezone">
                                                        Timezone
                                                    </FieldLabel>
                                                    <Select defaultValue={form.timezone} onValueChange={(value) => setForm({ ...form, timezone: value as string })}>
                                                        <SelectTrigger className="w-full" id="timezone">
                                                            <SelectValue placeholder="Select a timezone" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UTC-06:00">(UTC-06:00) Central Time (US and Canada)</SelectItem>
                                                            <SelectItem value="UTC-05:00">(UTC-05:00) Eastern Time (US and Canada)</SelectItem>
                                                            <SelectItem value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</SelectItem>
                                                            <SelectItem value="UTC-03:00">(UTC-03:00) Brazil, Buenos Aires</SelectItem>
                                                            <SelectItem value="UTC-02:00">(UTC-02:00) Mid-Atlantic</SelectItem>
                                                            <SelectItem value="UTC-01:00">(UTC-01:00) Azores</SelectItem>
                                                            <SelectItem value="UTC+00:00">(UTC+00:00) Greenwich Mean Time</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="interval">
                                                        Interval
                                                    </FieldLabel>
                                                    <Select defaultValue={form.intervalUnit} disabled={form.cronSyntax} onValueChange={(value) => setForm({ ...form, intervalUnit: value as "minute" | "hour" | "day" | "week" | "month" })}>
                                                        <SelectTrigger className="w-full" disabled={form.cronSyntax} id="run-every">
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
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="minutes">
                                                        Minutes
                                                    </FieldLabel>
                                                    <Select disabled={form.cronSyntax} onValueChange={(value) => setForm({ ...form, minutes: parseInt(value) as number })} value={String(form.minutes)}>
                                                        <SelectTrigger className="w-full" disabled={form.cronSyntax} id="minutes">
                                                            <SelectValue placeholder="Select a number of minutes" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 60 }, (_, index) => (
                                                                <SelectItem key={`minute-${index}`} value={String(index)}>{String(index)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="hours">
                                                        Hours
                                                    </FieldLabel>
                                                    <Select disabled={form.cronSyntax} onValueChange={(value) => setForm({ ...form, hours: parseInt(value) as number })} value={String(form.hours)}>
                                                        <SelectTrigger className="w-full" disabled={form.cronSyntax} id="hours">
                                                            <SelectValue placeholder="Select a number of hours" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 24 }, (_, index) => (
                                                                <SelectItem key={`hour-${index}`} value={String(index)}>{String(index)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                                <Field className="items-start" orientation="horizontal">
                                                    <FieldLabel className="mt-[6px] min-w-[144px]" htmlFor="days">
                                                        Cron syntax
                                                    </FieldLabel>
                                                    <div className="items-start flex flex-col gap-2 w-full">
                                                        <Toggle
                                                            className="border-(--gray-200) data-[state=on]:bg-[var(--blue-600)]/16 data-[state=on]:border-(--blue-800) data-[state=on]:text-[var(--blue-800)]"
                                                            id="cron-syntax"
                                                            onClick={() => {
                                                                const newCronSyntax = !form.cronSyntax;
                                                                setForm({ 
                                                                    ...form, 
                                                                    cronSyntax: newCronSyntax,
                                                                    expression: newCronSyntax && !form.expression ? generateCronExpression() : form.expression
                                                                });
                                                            }}
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            {form.cronSyntax 
                                                                ? <CheckIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 
                                                                : <div aria-label="checkbox" className="border border-(--gray-200) rounded-sm size-4" />
                                                            }
                                                            Show cron expression
                                                        </Toggle>
                                                        {form.cronSyntax && 
                                                            <Input
                                                                onChange={(e) => setForm({ ...form, expression: e.target.value as string | null })}
                                                                placeholder="Enter a cron expression"
                                                                type="text"
                                                                value={form.expression || generateCronExpression()}
                                                            />
                                                        }
                                                    </div>
                                                </Field>
                                            </FieldGroup>
                                        </FieldSet>
                                    </TabsContent>
                                </Tabs>
                            </Field>
                            <Separator />
                            <div className="items-center flex gap-2 justify-between">
                                <div className="items-center flex gap-2">
                                    <span className="text-sm font-medium">Trigger conditions</span>
                                </div>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => {
                                            const newCondition = {
                                                id: crypto.randomUUID(),
                                                label: `Condtion ${triggerConditions.length + 1}`,
                                                operator: triggerConditions.length > 0 ? ("AND" as const) : undefined,
                                                type: "sql", 
                                                value: "SELECT COUNT(*) > 0 FROM sales WHERE date = CURRENT_DATE()",
                                                onDelete: () => {},
                                                onOperatorChange: () => {},
                                            };
                                            setTriggerConditions([...triggerConditions, newCondition as unknown as TriggerConditionProps]);
                                        }}
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
                            {triggerConditions.length > 0 ? 
                            <div className="flex flex-col gap-4">
                                {triggerConditions.map((condition, index) => (
                                    <TriggerCondition 
                                        key={index} 
                                        {...condition} 
                                        onDelete={() => setTriggerConditions(triggerConditions.filter((_, i) => i !== index))}
                                        onOperatorChange={(operator) => {
                                            const updated = [...triggerConditions];
                                                updated[index] = { ...updated[index], operator: operator as "and" | "or" };
                                            setTriggerConditions(updated);
                                        }}
                                    />
                                ))}
                            </div>
                            : null }
                        </FieldGroup>
                    </FieldSet>
                    </div>
                    <DialogFooter>
                        <Button
                            className="rounded-sm text-[13px] h-8 px-3"
                            onClick={() => setShowTriggerDialog(false)}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 px-3"
                            onClick={() => {
                                const newTrigger: TriggerProps = {
                                    active: form.active,
                                    conditions: triggerConditions,
                                    id: trigger?.id || crypto.randomUUID(),
                                    recurrence: {
                                        interval: form.interval,
                                        intervalUnit: form.intervalUnit as "minute" | "hour" | "day" | "week" | "month",
                                        timezone: form.timezone,
                                        ...(form.cronSyntax && form.expression ? { expression: form.expression } : {}),
                                    },
                                    type: form.type as TriggerProps["type"],
                                };
                                setTrigger(newTrigger);
                                setShowTriggerDialog(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ApplicationShell>
    )
}
