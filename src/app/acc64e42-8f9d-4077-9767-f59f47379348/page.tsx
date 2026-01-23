"use client";

import { useState } from "react";

// Databricks Icons
import { ChevronDownIcon, OverflowIcon } from "@databricks/design-system";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// Patterns
import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Box } from "@/components/mini-patterns/box";

import Settings from "@/app/acc64e42-8f9d-4077-9767-f59f47379348/patterns/settings";
import TriggerDialog from "@/app/acc64e42-8f9d-4077-9767-f59f47379348/patterns/trigger-dialog";

export default function Page() {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    return (
        <ApplicationShell>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="p-4" defaultSize={75}>
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
                                    <Button className="bg-(--du-bois-blue-600) border-b-0 border-l-0 rounded-sm border-r-white border-r-1 border-t-0 text-white hover:bg-(--du-bois-blue-700) hover:text-white" size="sm" variant="outline">Run now</Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="bg-(--du-bois-blue-600) rounded-sm border-none text-white hover:bg-(--du-bois-blue-700) hover:text-white" size="icon-sm" variant="outline">
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
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel className="p-4" defaultSize={25}>
                    <Settings
                        author="andrew.wierzba@databricks.com"
                        description="This job processes raw customer activity logs from the previous 24 hours and generates aggregated metrics for dashboard reporting."
                        id="63481d34-4170-44c9-9def-eae3d60db014"
                        onAddTrigger={() => setShowDialog(true)}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Trigger Dialog */}
            <TriggerDialog 
                open={showDialog} 
                onOpenChange={setShowDialog}
                onSubmit={(trigger) => {
                    console.log('Trigger created:', trigger);
                    setShowDialog(false);
                }}
            />
        </ApplicationShell>
    )
}

