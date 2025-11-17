"use client";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Box } from "@/components/mini-patterns/box";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Page() {
    return (
        <ApplicationShell>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50}>
                    <div className="items-center flex h-full justify-center p-4">
                        <Box className="items-center border-dashed flex h-full justify-center w-full">
                            <span className="font-medium">One</span>
                        </Box>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={25}>
                            <div className="items-center flex h-full justify-center p-4">
                                <Box className="items-center border-dashed flex h-full justify-center w-full">
                                    <span className="font-medium">Two</span>
                                </Box>
                            </div>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={75}>
                            <div className="items-center flex h-full justify-center p-4">
                                <Box className="items-center border-dashed flex h-full justify-center w-full">
                                    <span className="font-medium">Three</span>
                                </Box>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </ApplicationShell>
    );
}
