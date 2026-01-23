"use client";

import { useState } from "react";

import { ChevronDownIcon, FileCodeIcon, FolderIcon, OverflowIcon, WorkflowsIcon } from "@databricks/design-system";
import { Node } from "reactflow";

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

import WorkspacePanel from "@/components/mini-patterns/panels/workspace";

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
    const [showPanel1, setShowPanel1] = useState<boolean>(false);
    
    // State for graph nodes - start with empty canvas
    const [graphNodes, setGraphNodes] = useState<Node[]>([]);
    
    // State for triggers - start with empty array
    const [triggers, setTriggers] = useState<TriggerProps[]>([]);
    
    // State for tabs
    const [tabs, setTabs] = useState([
        { id: "tab-1", label: "Tab 1" },
        { id: "tab-2", label: "Tab 2", icon: WorkflowsIcon }
    ]);
    const [activeTab, setActiveTab] = useState("tab-2");

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
                            <div className={showPanel1 ? "flex-1" : "hidden"}>
                                <WorkspacePanel />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={75}>
                        <Tabs className="h-full" value={activeTab} onValueChange={setActiveTab}>
                            <TabsList>
                                {tabs.map((tab) => (
                                    <TabsTrigger 
                                        icon={tab.icon}
                                        key={tab.id}
                                        onClose={() => {
                                            if (tabs.length > 1) {
                                                const newTabs = tabs.filter(t => t.id !== tab.id);
                                                setTabs(newTabs);
                                                if (activeTab === tab.id) {
                                                    setActiveTab(newTabs[0]?.id || "");
                                                }
                                            }
                                        }} 
                                        value={tab.id}
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
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
                                        nodes={graphNodes}
                                        onNodesChange={setGraphNodes}
                                        triggers={triggers}
                                    />
                                </div>
                            </TabsContent>
                            {tabs.find(t => t.id === "job-yml") && (
                                <TabsContent className="bg-white h-full p-4" value="job-yml">
                                    <div className="flex flex-col gap-4 h-full">
                                        <Code
                                            addedLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                                            disabled
                                            lineCount
                                            type="yaml"
                                            value={`name: market-analysis-job

tasks:
  - task_key: notebook_task
    notebook_task:
      notebook_path: /Users/workspace/load-market-analysis

schedule:
  quartz_cron_expression: "0 * * * ?"
  timezone_id: "America/Los_Angeles"
  pause_status: "UNPAUSED"`}
                                        />
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </ResizablePanel>
                </ResizablePanelGroup>
                {showAssistant &&
                    <Assistant
                        defaultWidth="384px"
                        responses={[
                            {
                                content: "I found the following notebooks, which notebook would you like to use?",
                                delay: 2000,
                                previewCard: {
                                    content: (
                                        <>
                                            <div className="items-center border-t border-neutral-100 flex gap-2 px-3 py-2">
                                                <span className="bg-neutral-100 rounded-sm text-neutral-500 text-xs h-6 min-w-6 p-1 text-center">1</span>
                                                <span>load-market-analysis.ipynb</span>
                                            </div>
                                            <div className="items-center border-t border-neutral-100 flex gap-2 px-3 py-2">
                                                <span className="bg-neutral-100 rounded-sm text-neutral-500 text-xs h-6 min-w-6 p-1 text-center">2</span>
                                                <span>data-ingestion.ipynb</span>
                                            </div>
                                            <div className="items-center border-t border-neutral-100 flex gap-2 px-3 py-2">
                                                <span className="bg-neutral-100 rounded-sm text-neutral-500 text-xs h-6 min-w-6 p-1 text-center">3</span>
                                                <span>process-sales-data.ipynb</span>
                                            </div>
                                        </>
                                    ),
                                    header: {
                                        title: "Found 3 notebooks"
                                    }
                                },
                            },
                            {
                                actions: [
                                    { 
                                        label: "Accept", 
                                        onClick: () => {
                                            const newNodeId = `node-${Date.now()}`;
                                            const newNode: Node = {
                                                id: newNodeId,
                                                data: { label: "notebook_task" },
                                                position: { 
                                                    x: Math.random() * 200 + 100, 
                                                    y: Math.random() * 200 + 100 
                                                },
                                                type: "custom",
                                                selected: false
                                            };
                                            setGraphNodes(prev => [...prev, newNode]);

                                            const newTrigger: TriggerProps = {
                                                id: `trigger-${Date.now()}`,
                                                type: "schedule",
                                                status: true,
                                                scheduleMode: "simple",
                                                interval: 1,
                                                timeUnit: "hour",
                                                hour: 0,
                                                minute: 0,
                                                timezone: "America/Los_Angeles"
                                            };
                                            setTriggers(prev => [...prev, newTrigger]);
                                        }
                                    },
                                    { label: "Reject", onClick: () => {} },
                                ],
                                content: (
                                    <>
                                        <p className="mb-2">I&apos;ll update the job to include a notebook task.</p>
                                        <div>
                                            <p className="font-semibold mb-1">Changes to apply:</p>
                                            <ol className="list-decimal list-outside pl-6">
                                                <li><strong>Add a notebook task —</strong> Add notebook task with the <Badge asChild className="rounded-sm font-mono" variant="outline"><Link href="/notebooks/load-market-analysis">load-market-analysis</Link></Badge> notebook</li>
                                                <li><strong>Add a cron trigger —</strong> Add a cron trigger to run the job every hour</li>
                                            </ol>
                                        </div>
                                    </>
                                ),
                                delay: 2000,
                                previewCard: {
                                    content: (
                                        <div className="p-3">
                                            <Code
                                                addedLines={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                                                disabled
                                                lineCount
                                                type="python"
                                                value={`name: market-analysis-job

tasks:
  - task_key: notebook_task
    notebook_task:
      notebook_path: /Users/workspace/load-market-analysis

schedule:
  quartz_cron_expression: "0 * * * ?"
  timezone_id: "America/Los_Angeles"
  pause_status: "UNPAUSED"`}
                                            />
                                        </div>
                                    ),
                                    header: {
                                        title: (
                                            <div className="items-center flex gap-2">
                                                <span>1 File </span>
                                                <button
                                                    aria-label="Open job.yml file"
                                                    className="items-center text-neutral-500 flex gap-1 hover:underline cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const tabId = "job-yml";
                                                        if (!tabs.find(t => t.id === tabId)) {
                                                            setTabs([...tabs, { id: tabId, label: "job.yml" }]);
                                                        }
                                                        setActiveTab(tabId);
                                                    }}
                                                >
                                                    <FileCodeIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                    <span className="text-black">job.yml</span>
                                                </button>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <span className="text-green-600">+11</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <span>11 lines added, 0 removed</span>
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
