"use client";

import { useState } from "react";

import { ChevronDownIcon, FileCodeIcon, FolderIcon, OverflowIcon, WorkflowsIcon } from "@databricks/design-system";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@/components/ui/link";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Assistant } from "@/components/ui/patterns/assistant";
import { Code } from "@/components/mini-ui/code";
import { Box } from "@/components/mini-patterns/box";
import Resizable from "./content";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../patterns/tabs";

interface NotificationProps {
    failure?: boolean;
    id: string;
    start?: boolean;
    success?: boolean;
    type: "email" | "slack" | "webhook";
    value?: string;
}

interface ParameterProps {
    id: string;
    value: string;
}

interface Props {
    enabled?: boolean;
}

export default function Page({ enabled = false }: Props) {
    const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
    const [showAssistant, setShowAssistant] = useState(true);
    const [showPanel1, setShowPanel1] = useState<boolean>(true);
    const [parameters, setParameters] = useState<ParameterProps[]>([]);
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    return (
        <ApplicationShell
            showAssistant={showAssistant}
            onToggleAssistant={setShowAssistant}
        >
            <div className="flex h-full">
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                    <ResizablePanel className={`${!showPanel1 && 'max-w-12'}`} defaultSize={25}>
                        <div className="bg-white flex h-full">
                            <div className="border-r border-gray-200 p-2">
                                <Button onClick={() => setShowPanel1(!showPanel1)} size="icon-sm" variant="ghost">
                                    <FolderIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                </Button>
                            </div>
                            {showPanel1 && (
                                <div className="p-4 w-full">
                                    <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                                        <span className="text-center">Panel 1</span>
                                    </Box>
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={75}>
                        <Tabs className="h-full" defaultValue="tab-2">
                            <TabsList>
                                <TabsTrigger onClose={() => {}} value="tab-1">Tab 1</TabsTrigger>
                                <TabsTrigger icon={WorkflowsIcon} onClose={() => {}} value="tab-2">Tab 2</TabsTrigger>
                            </TabsList>
                            <TabsContent className="bg-white h-full p-4" value="tab-1">
                                <div className="flex flex-col gap-4 h-full">
                                    <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-8 items-center justify-center w-full">
                                        <span className="text-center">Toolbar</span>
                                    </Box>
                                    <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                                        <span className="text-center">Tab 1</span>
                                    </Box>
                                </div>
                            </TabsContent>
                            <TabsContent className="bg-white h-full p-4" value="tab-2">
                                <div className="flex flex-col gap-4 h-full">
                                    <div className="flex gap-2">
                                        <Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
                                            <span className="text-center">Navigation / toolbar</span>
                                        </Box>
                                        <div className="flex gap-2 justify-end">
                                            <Button size="icon-sm" variant="ghost">
                                                <OverflowIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                            </Button>
                                            <ButtonGroup>
                                                <Button
                                                    className="bg-sky-600 border-b-0 border-l-0 rounded-sm border-r-white border-r-1 border-t-0 text-white hover:bg-sky-700 hover:text-white"
                                                    disabled={!isEnabled}
                                                    size="sm"
                                                    variant="outline"
                                                    >
                                                        Run now
                                                    </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild disabled={!isEnabled}>
                                                        <Button className="bg-sky-600 rounded-sm border-none text-white hover:bg-sky-700 hover:text-white" size="icon-sm" variant="outline">
                                                            <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="border-gray-200">
                                                        <DropdownMenuItem>Run now with different settings</DropdownMenuItem>
                                                        <DropdownMenuItem>Run backfill</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </ButtonGroup>
                                        </div>
                                    </div>
                                    <Resizable 
                                        notifications={notifications}
                                        parameters={parameters}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </ResizablePanel>
                </ResizablePanelGroup>
                {showAssistant &&
                    <Assistant
                        defaultWidth="384px"
                        responses={[
                            {
                                actions: [
                                    { 
                                        label: "Accept", 
                                        onClick: () => {
                                            // Add parameters
                                            setParameters([
                                                { id: "param1", value: "value1" },
                                                { id: "param2", value: "value2" }
                                            ]);
                                            
                                            // Add Slack notification for dev channel
                                            setNotifications([
                                                {
                                                    id: `notification-${Date.now()}`,
                                                    type: "slack",
                                                    value: "dev",
                                                    success: true,
                                                    failure: true,
                                                    start: false
                                                }
                                            ]);
                                        }
                                    },
                                    { label: "Reject", onClick: () => {} },
                                ],
                                content: (
                                    <>
                                        <p className="mb-2">I&apos;ll update the job to include the requested parameters and Slack notification.</p>
                                        <div>
                                            <p className="font-semibold mb-1">Changes to apply:</p>
                                            <ol className="list-decimal list-outside pl-6">
                                                <li><strong>Add parameters —</strong> Add <Badge asChild className="rounded-sm font-mono" variant="outline"><span>param1: value1</span></Badge> and <Badge asChild className="rounded-sm font-mono" variant="outline"><span>param2: value2</span></Badge> parameters</li>
                                                <li><strong>Add Slack notification —</strong> Configure Slack notification for the <Badge asChild className="rounded-sm font-mono" variant="outline"><span>dev</span></Badge> channel</li>
                                            </ol>
                                        </div>
                                    </>
                                ),
                                delay: 2000,
                                previewCard: {
                                    content: (
                                        <div className="p-3">
                                            <Code
                                                addedLines={[3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]}
                                                disabled
                                                lineCount
                                                type="yaml"
                                                value={`name: market-analysis-job

    parameters:
    - name: param1
        default: "value1"
    - name: param2
        default: "value2"

    tasks:
    - task_key: notebook_task
        notebook_task:
        notebook_path: /Users/workspace/load-market-analysis

    schedule:
    quartz_cron_expression: "0 * * * ?"
    timezone_id: "America/Los_Angeles"
    pause_status: "UNPAUSED"

    notifications:
    - on_start: []
        on_success: []
        on_failure: []
        on_duration_warning_threshold_exceeded: []
        email_notifications:
        on_start: []
        on_success: []
        on_failure: []
        on_duration_warning_threshold_exceeded: []
        slack_notifications:
        on_start: []
        on_success: []
        on_failure: []
        on_duration_warning_threshold_exceeded: []
        slack_webhook_url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
        slack_channels: ["dev"]`}
                                            />
                                        </div>
                                    ),
                                    header: {
                                        title: (
                                            <div className="items-center flex gap-2">
                                                <span>1 File </span>
                                                <button
                                                    className="items-center text-neutral-500 flex gap-1 hover:underline cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Handle tab opening logic
                                                    }}
                                                >
                                                    <FileCodeIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                    <span className="text-black">job.yml</span>
                                                </button>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className="text-green-600">+26</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span>26 lines added, 0 removed</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        )
                                    }
                                },
                            },
                        ]}
                        onClose={() => setShowAssistant(false)}
                    />
                }
            </div>
        </ApplicationShell>
    )
}
