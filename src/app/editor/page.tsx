"use client"

import { FileEditor } from "@/components/ui/patterns/file-editor"
import { Workspace } from "@/components/ui/patterns/workspace-browser"
import { ApplicationShell } from "@/components/ui/patterns/application-shell"

export default function Page() {
    return (
        <ApplicationShell>
            <div aria-label="editor" className="flex h-full">
                <Workspace />
                <FileEditor />
            </div>
        </ApplicationShell>
    )
}
