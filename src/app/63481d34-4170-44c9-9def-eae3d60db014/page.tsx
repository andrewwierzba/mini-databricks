"use client";

import { useState } from "react";

import { ChevronDownIcon, FolderIcon, OverflowIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Box } from "@/components/mini-patterns/box";
import Resizable from "./patterns/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./patterns/tabs";

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

export default function Page() {
    const [showPanel1, setShowPanel1] = useState<boolean>(true);
    
    // Store original values for revert functionality
    const originalParameters: ParameterProps[] = [
        { id: "param1", value: "value1" }
    ];
    const originalNotifications: NotificationProps[] = [
        { failure: false, id: "notification1", start: false, success: true, type: "slack", value: "slack://channel/123" }
    ];
    
    const [parameters, setParameters] = useState<ParameterProps[]>(originalParameters);
    const [notifications, setNotifications] = useState<NotificationProps[]>(originalNotifications);

    const handleApplyChanges = () => {
        // Apply changes when second response is displayed
        setParameters([
            { id: "param1", value: "updated_value1" },
            { id: "param2", value: "new_value2" }
        ]);
        setNotifications([
            { failure: true, id: "notification1", start: false, success: true, type: "slack", value: "slack://channel/123" },
            { failure: false, id: "notification2", start: true, success: false, type: "email", value: "andrew.wierzba@databricks.com" }
        ]);
    };

    const handleRevertChanges = () => {
        // Revert to original values
        setParameters(originalParameters);
        setNotifications(originalNotifications);
    };

    return (
        <ApplicationShell
            onApplyChanges={handleApplyChanges}
            onRevertChanges={handleRevertChanges}
        >
            <ResizablePanelGroup direction="horizontal">
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
                    <Tabs className="h-full" defaultValue="tab-1">
                        <TabsList>
                            <TabsTrigger onClose={() => {}} value="tab-1">Tab 1</TabsTrigger>
                            <TabsTrigger onClose={() => {}} value="tab-2">Tab 2</TabsTrigger>
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
                                            <Button className="bg-sky-600 border-b-0 border-l-0 rounded-sm border-r-white border-r-1 border-t-0 text-white hover:bg-sky-700 hover:text-white" size="sm" variant="outline">Run now</Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
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
        </ApplicationShell>
    )
}
