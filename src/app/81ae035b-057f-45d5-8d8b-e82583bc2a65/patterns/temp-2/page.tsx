"use client";

import { useState } from "react";

import { Code } from "@/components/mini-ui/code";
import { Assistant } from "@/components/ui/patterns/assistant";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

// =============================================================================
// PAGE WITH APP LAYOUT + ASSISTANT PATTERN CHAT PANEL
// LLM-specialist: Plan, Stream of thought, Verification, References
// =============================================================================

function Ref({ children }: { children: React.ReactNode }) {
    return (
        <span className="bg-muted inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-xs">
            {children}
        </span>
    );
}

const assistantResponses = [
    {
        content: (
            <>
                <p className="mb-2">I found the job <Ref>analytics.customers</Ref>. Here’s the plan:</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Find job and underlying assets</li>
                    <li>Determine task type and create task</li>
                    <li>Apply compute and dependencies</li>
                    <li>Validate and confirm position</li>
                    <li>Save after you verify</li>
                </ul>
            </>
        ),
        delay: 400,
        previewCard: {
            content: (
                <ul className="space-y-1 p-2 text-[11px] text-muted-foreground">
                    <li>Located job analytics.customers</li>
                    <li>Listing tasks and assets…</li>
                </ul>
            ),
            header: { title: "Thought" },
            isExpanded: false,
            status: "completed" as const,
        },
    },
    {
        content: (
            <>
                <p className="mb-2">The job has 3 tasks. I identified the asset <Ref>notebooks/customers_daily_snapshot</Ref> (Notebook). Creating a notebook task. Task draft:</p>
            </>
        ),
        previewCard: {
            content: (
                <Code
                    className="flex-1 max-h-32 min-w-0 text-[11px]"
                    disabled
                    lineCount
                    type="yaml"
                    value={`{
  "task_key": "customers_daily_snapshot",
  "type": "notebook",
  "source": { "path": "notebooks/customers_daily_snapshot" },
  "compute": null,
  "depends_on": []
}`}
                />
            ),
            diff: { added: 4 },
            header: { title: "Task draft" },
            isExpanded: true,
            status: "completed" as const,
            verification: {
                actions: [
                    { id: "reject", label: <>Reject <span className="text-neutral-500 text-xs mt-0.5">ESC</span></>, onClick: () => {}, variant: "outline" as const },
                    { id: "accept", label: <>Accept <span className="text-xs  mt-0.5">⌘⏎</span></>, onClick: () => {}, variant: "default" as const },
                ],
                required: true,
            },
        },
    },
    {
        content:
            "Task created. I applied compute Small and dependency on raw_ingest. Validation passed. Flow change: new node customers_daily_snapshot after raw_ingest. Verify before I save?",
        previewCard: {
            content: (
                <ul className="list-inside list-disc space-y-1 p-2 text-[11px] text-muted-foreground">
                    <li>+ customers_daily_snapshot (after raw_ingest)</li>
                    <li>Compute: Small</li>
                    <li>Depends on: raw_ingest</li>
                </ul>
            ),
            header: { title: "Flow changes" },
            isExpanded: false,
            status: "completed" as const,
        },
        actions: [
            { label: "Accept", onClick: () => {} },
            { label: "Reject", onClick: () => {} },
        ],
    },
    {
        content:
            "Job analytics.customers saved. The new task customers_daily_snapshot is in place and will run after raw_ingest.",
    },
];

export default function Page() {
    const [panelCollapsed, setPanelCollapsed] = useState(false);

    return (
        <ResizablePanelGroup
            className="h-full w-full"
            direction="horizontal"
        >
            <ResizablePanel
                className="min-w-[320px]"
                defaultSize={70}
            >
                <div className="flex h-full flex-col gap-4 p-4">
                    <div className="border-(--du-bois-color-border) bg-muted/30 flex flex-1 items-center justify-center rounded-sm border border-dashed">
                        <p className="text-muted-foreground text-sm">
                            Main content area
                        </p>
                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
                className="min-w-[280px]"
                defaultSize={30}
            >
                {!panelCollapsed && (
                    <Assistant
                        defaultWidth="100%"
                        minWidth="256px"
                        onClose={() => setPanelCollapsed(true)}
                        responses={assistantResponses}
                    />
                )}
                {panelCollapsed && (
                    <div className="border-(--du-bois-color-border) flex h-full items-center justify-center border-l">
                        <button
                            className="text-muted-foreground hover:text-foreground text-sm underline"
                            onClick={() => setPanelCollapsed(false)}
                            type="button"
                        >
                            Open Assistant
                        </button>
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
