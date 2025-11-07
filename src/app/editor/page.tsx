"use client"

import { FileEditor } from "@/components/ui/patterns/file-editor"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { ApplicationShell } from "@/components/ui/patterns/application-shell"

export default function Page() {
    return (
        <ApplicationShell>
            <div className="flex h-full overflow-hidden">
                <Workspace />
                <div className="w-full">
                    <FileEditor />
                </div>
            </div>
        </ApplicationShell>
    )
}
