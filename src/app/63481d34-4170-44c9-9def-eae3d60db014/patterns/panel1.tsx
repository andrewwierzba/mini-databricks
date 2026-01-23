import { PauseIcon, PlayIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { SlackIcon } from "@/assets/icons/slack-icon";

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
    author: string;
    description?: string;
    id: string;
    notifications?: NotificationProps[];
    parameters?: ParameterProps[];
    tags?: TagProps[];
    triggers?: TriggerProps[];
}

export default function Panel1({ 
    author = "andrew.wierzba@databricks.com",
    description,
    id = "216bec6d-e892-413c-a70c-15c977db4dbb",
    notifications,
    parameters,
    tags,
    triggers,
}: Props) {
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
                <div aria-label="description" className="items-start flex gap-2">
                    <span className="max-w-24 w-full">Description</span>
                    <div className="flex flex-col gap-2 w-full">
                        <span>{description}</span>
                        <Button
                            className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
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
                                    <Button
                                        aria-label="add-trigger"
                                        className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
                                        size="sm"
                                        variant="outline"
                                    >
                                        Edit trigger
                                    </Button>
                                    <Button
                                        aria-label="pause-trigger"
                                        className="border-gray-200 rounded-sm text-[13px] gap-1 h-6 px-2 w-fit"
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
                                    <Button
                                        aria-label="delete-trigger"
                                        className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
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
                    <div className="flex flex-col gap-2">
                        <span>No triggers configured.</span>
                        <Button
                            aria-label="add-trigger"
                            className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
                            size="sm"
                            variant="outline"
                        >
                            Add trigger
                        </Button>
                    </div>
                )}
            </div>,
        label: "Schedules & triggers"
    }, {
        content: 
            parameters && parameters.length > 0 ? (
                <>
                    <div className="flex flex-wrap gap-2">
                        {parameters.map((parameter) => (
                            <span className="bg-gray-200 rounded-sm px-1.5" key={parameter.id}>{parameter.id}: {parameter.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-parameters"
                        className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
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
                            <span className="bg-gray-200 rounded-sm px-1.5" key={tag.id}>{tag.id}: {tag.value}</span>
                        ))}
                    </div>
                    <Button
                        aria-label="configure-tags"
                        className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
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
                        className="border-gray-200 rounded-sm text-[13px] h-6 px-2 w-fit"
                        size="sm"
                        variant="outline"
                    >
                        {(notifications && notifications.length > 0) ? "Edit notifications" : "Add notifications"}
                    </Button>
                </>
            ) : <span>No notifications configured.</span>,
        label: "Notifications"
    }];

    return (
        <div aria-label="panel-1" className="bg-white h-full overflow-y-scroll p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:opacity-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-opacity [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-color:rgb(209_213_219)_transparent] [scrollbar-width:thin] hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:opacity-100">
            {/* <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                <span className="text-center">Panel 1</span>
            </Box> */}

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
        </div>
    );
}
