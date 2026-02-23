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
import { Graph } from "@/components/ui/patterns/graph";

import Settings from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/patterns/settings";
import TriggerDialog, { TriggerProps } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-dialog";
import { FieldOrientation, Props as TriggerFormProps } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-form";

import { ApplicationSettings } from "@/components/mini-ui/application-settings";

export default function Page() {
    const [orientation, setOrientation] = useState<FieldOrientation>("horizontal");
    const [showDialog, setShowDialog] = useState<boolean>(true);
    const [trigger, setTrigger] = useState<TriggerProps | undefined>(undefined);
    const [variant, setVariant] = useState<NonNullable<TriggerFormProps["variant"]>>("default");

    return (
        <>
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

                            {/* Directed Acyclic Graph (DAG) */}
                            <Graph className="min-h-0 flex-1" />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel className="p-4" defaultSize={25}>
                        <Settings
                            author="andrew.wierzba@databricks.com"
                            compute="Serverless"
                            description="This job processes raw customer activity logs from the previous 24 hours and generates aggregated metrics for dashboard reporting."
                            id="63481d34-4170-44c9-9def-eae3d60db014"
                            onAddTrigger={() => setShowDialog(true)}
                            onEditTrigger={() => setShowDialog(true)}
                            trigger={trigger}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>

                {/* Trigger Dialog */}
                <TriggerDialog
                    onOpenChange={setShowDialog}
                    onSubmit={(trigger) => {
                        console.log('Trigger created:', trigger);

                        setTrigger(trigger);
                        setShowDialog(false);
                    }}
                    open={showDialog}
                    orientation={orientation}
                    variant={variant}
                />
            </ApplicationShell>
            <ApplicationSettings
                controls={[
                    {
                        id: "variant",
                        label: "Variant",
                        onChange: (value) => setVariant(value as NonNullable<TriggerFormProps["variant"]>),
                        options: [
                            { label: "Default", value: "default" },
                            { label: "Combined", value: "combined" },
                        ],
                        type: "select",
                        value: variant,
                    },
                    {
                        id: "orientation",
                        label: "Orientation",
                        onChange: (value) => setOrientation(value as FieldOrientation),
                        options: [
                            { label: "Horizontal", value: "horizontal" },
                            { label: "Vertical", value: "vertical" },
                        ],
                        type: "select",
                        value: orientation,
                    },
                ]}
            />
        </>
    )
}

