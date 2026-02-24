import { useState } from "react";

import { ChevronDownIcon, ChevronRightIcon, PauseIcon, PencilIcon, PlayIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { SlackIcon } from "@/assets/icons/slack-icon";

interface AdvancedProps {
    maximumConcurrentRuns: number;
    queue: boolean;
}

interface ComputeProps {
    id: string;
    value: string;
}

interface GitProps {
    branch?: string;
    commit?: string;
    provider: "awsCodeCommit" | "azureDevOpsServices" | "bitbucketCloud" | "bitbucketServer" | "gitHub" | "gitHubEnterprise" | "gitLab" | "gitLabEnterpriseEdition";
    url: string;
}

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

interface TriggerProps {
    conditions?: Array<{ type: string }>;
    cronExpression?: string;
    hour?: number;
    id: string;
    interval?: number;
    minute?: number;
    scheduleMode?: "simple" | "advanced";
    status?: boolean;
    timeUnit?: string;
    timezone?: string;
    type: string;
    useCronExpression?: boolean;
}

interface Props {
    advanced?: AdvancedProps;
    author: string;
    compute?: ComputeProps[];
    description?: string;
    git?: GitProps;
    id: string;
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
    tags?: TagProps[];
    triggers?: TriggerProps[];
    onAddTrigger?: () => void;
    onDeleteTrigger?: () => void;
    onEditTrigger?: () => void;
}

export default function Panel({ 
    advanced = { maximumConcurrentRuns: 1, queue: true },
    author = "andrew.wierzba@databricks.com",
    compute,
    description,
    git,
    id = "216bec6d-e892-413c-a70c-15c977db4dbb",
    notifications = [],
    parameters = [],
    tags = [],
    triggers = [],
    onAddTrigger,
    onDeleteTrigger,
    onEditTrigger,
}: Props) {
    const sections = [{
        content: 
            <div className="flex flex-col gap-2">
                <div aria-label="id" className="flex gap-2">
                    <span className="max-w-24 w-full">Job ID</span>
                    <span className="truncate flex-1 min-w-0">{id}</span>
                </div>
                <div aria-label="author" className="flex gap-2">
                    <span className="max-w-24 w-full">Creator</span>
                    <span className="truncate flex-1 min-w-0">{author}</span>
                </div>
                <div aria-label="run-as" className="flex gap-2">
                    <span className="mt-0.5 max-w-24 w-full">Run as</span>
                    <span className="mt-0.5 truncate min-w-0">{author}</span>
                    <Button
                        aria-label="edit-run-as"
                        className="border-neutral-200 rounded-sm size-6"
                        size="icon-sm"
                        variant="ghost"
                    >
                        <PencilIcon
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        />
                    </Button>
                </div>
                <div aria-label="description" className="items-start flex gap-2">
                    <span className="max-w-24 w-full">Description</span>
                    <div className="flex flex-col gap-2 w-full">
                        <span>{description}</span>
                        <Button
                            className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                            size="sm"
                            variant="outline"
                        >
                            {description ? "Edit description" : "Add description"}
                        </Button>
                    </div>
                </div>
                <div aria-label="lineage" className="flex gap-2">
                    <span className="max-w-24 w-full">Lineage</span>
                    <span className="truncate flex-1 min-w-0">No lineage available.</span>
                </div>
                <div aria-label="performance-optimized" className="flex gap-2">
                    <span className="max-w-24 w-full">Performance optimized</span>
                    <Switch className="data-[state=checked]:bg-sky-600" onCheckedChange={() => {}} />
                </div>
            </div>,
        label: "Details"
    }, {
        content: 
            <div className="flex flex-col gap-2">
                {triggers && triggers.length > 0 ? (
                    <div className="flex flex-col gap-2 mt-2">
                        {triggers.map((trigger) => (
                            <div key={trigger.id} className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold capitalize">{trigger.type} {trigger.status === false ? "(Paused)" : ""}</span>
                                    {trigger.type === "schedule" && trigger.scheduleMode === "simple" && (
                                        <span className="truncate">Every {trigger.interval} {trigger.timeUnit}</span>
                                    )}
                                    {trigger.type === "schedule" && trigger.scheduleMode === "advanced" && (
                                        <span className="truncate">
                                            {trigger.useCronExpression && trigger.cronExpression 
                                                ? `Cron: ${trigger.cronExpression}`
                                                : `Every ${trigger.timeUnit} at ${String(trigger.hour ?? 0).padStart(2, "0")}:${String(trigger.minute ?? 0).padStart(2, "0")} (${trigger.timezone || "UTC"})`
                                            }
                                        </span>
                                    )}
                                    {trigger.type === "schedule" && !trigger.scheduleMode && (
                                        <span className="truncate">Every {trigger.interval} {trigger.timeUnit}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {/* Edit trigger */}
                                    <Button
                                        aria-label="add-trigger"
                                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                                        onClick={onEditTrigger}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Edit trigger
                                    </Button>

                                    {/* Set trigger */}
                                    {trigger.status ? (
                                        <Button
                                            aria-label="pause-trigger"
                                            className="border-neutral-200 rounded-sm gap-1 h-6 px-2 w-fit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            <PauseIcon
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            />
                                            Pause
                                        </Button>
                                    ) : (
                                        <Button
                                            aria-label="pause-trigger"
                                            className="border-neutral-200 rounded-sm gap-1 h-6 px-2 w-fit"
                                            size="sm"
                                            variant="outline"
                                        >
                                            <PlayIcon
                                                onPointerEnterCapture={undefined}
                                                onPointerLeaveCapture={undefined}
                                            />
                                            Resume
                                        </Button>
                                    )}

                                    {/* Delete trigger */}
                                    <Button
                                        aria-label="delete-trigger"
                                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                                        onClick={onDeleteTrigger}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <span>No triggers configured.</span>
                        <Button
                            aria-label="add-trigger"
                            className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                            onClick={onAddTrigger}
                            size="sm"
                            variant="outline"
                        >
                            Add triggers
                        </Button>
                    </>
                )}
            </div>,
        label: "Schedules & triggers"
    }, {
        content: 
            parameters && parameters.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {parameters.map((parameter) => (
                            <span className="bg-neutral-200 rounded-sm px-1.5" key={parameter.id}>{parameter.id}: {parameter.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-parameters"
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        Edit parameters
                    </Button>
                </>
            ) : 
                <>
                    <span>No parameters configured.</span>
                    <Button
                        aria-label="configure-parameters"
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        Add parameters
                    </Button>
                </>,
        label: "Parameters"
    }, {
        content: 
            <>
                {compute ? (
                    <div className="flex flex-wrap gap-2">
                        {compute.map((compute) => (
                            <span className="bg-gray-200 rounded-sm px-1.5" key={compute.id}>{compute.value}</span>
                        ))}
                    </div>
                ) : (
                    <span>No compute configured.</span>
                )}
                <Button
                    aria-label="configure-compute"
                    className="border-gray-200 rounded-sm h-6 px-2 w-fit"
                    size="sm"
                    variant="outline"
                >
                    {compute && compute.length > 0 ? "Swap" : "Add compute"}
                </Button>
            </>,
        label: "Compute"
    }, {
        content: 
            tags && tags.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span className="bg-gray-200 rounded-sm px-1.5" key={tag.id}>{tag.id}: {tag.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-tags"
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {tags.length > 0 ? "Edit tags" : "Add tags"}
                    </Button>
                </>
            ) : 
                <>
                    <span>No tags configured.</span>
                    <Button
                        aria-label="add-tag"
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        Add tags
                    </Button>
                </>,
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
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {(notifications && notifications.length > 0) ? "Edit notifications" : "Add notifications"}
                    </Button>
                </>
            ) : 
                <>
                    <span>No notifications configured.</span>
                    <Button
                        aria-label="add-notification"
                        className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        Add notifications
                    </Button>
                </>,
        label: "Notifications"
    }, {
        content: 
            <>
                <span>No git settings configured.</span>
                <Button
                    aria-label="add-git"
                    className="border-neutral-200 rounded-sm h-6 px-2 w-fit"
                    size="sm"
                    variant="outline"
                >
                    Add git
                </Button>
            </>,
        label: "Git"
    }, {
        content: 
            <div className="flex flex-col gap-2">
                <div aria-label="queue" className="flex gap-2">
                    <span className="max-w-24 w-full">Queue</span>
                    <Switch
                        aria-label="queue-switch"
                        checked={advanced?.queue}
                        className="data-[state=checked]:bg-sky-600"
                        onCheckedChange={() => {}}
                    />
                </div>
                <div aria-label="maximum-concurrent-runs" className="flex gap-2">
                    <span className="mt-0.5 max-w-24 w-full">Maximum concurrent runs</span>
                    <span className="mt-0.5">{advanced?.maximumConcurrentRuns}</span>
                    <Button
                        aria-label="edit-maximum-concurrent-runs"
                        className="border-neutral-200 rounded-sm size-6"
                        size="icon-sm"
                        variant="ghost"
                    >
                        <PencilIcon
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        />
                    </Button>
                </div>
            </div>,
        label: "Advanced"
    }, ];

    const [collapsedSections, setCollapsedSections] = useState<number[]>([7]);

    return (
        <div aria-label="panel-1" className="bg-white h-full overflow-y-scroll p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:opacity-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-opacity [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-color:rgb(209_213_219)_transparent] [scrollbar-width:thin] hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:opacity-100">
            {sections.map((section, index) => (
                <div
                    aria-label="panel-section"
                    className={`${index > 0 ? 'border-t' : ''} border-neutral-200 flex flex-col text-sm gap-2 p-4 w-full`}
                    key={`panel-section-${index}`}
                >
                    <div className="items-center flex font-bold gap-1.5" onClick={() => setCollapsedSections((prev) => prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index])}>
                        {!collapsedSections.includes(index) ? <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <ChevronRightIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        {section.label}
                    </div>
                    {!collapsedSections.includes(index) && (
                        <div className="flex flex-col gap-2 pl-6">
                            {section.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
