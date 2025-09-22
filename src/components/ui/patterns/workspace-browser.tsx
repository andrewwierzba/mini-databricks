"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { ArrowLeftIcon, CloseIcon, DataIcon, FileIcon, FolderIcon, FolderFillIcon, QueryEditorIcon, Typography } from "@databricks/design-system"

const { Text } = Typography

const data = [{
    name: "folder_1",
    type: "folder"
}, {
    name: "folder_2",
    type: "folder"
}, {
    name: "folder_3",
    type: "folder"
}, {
    name: "folder_4",
    type: "folder"
}]

export function FileBrowser({ onClose }: { onClose: () => void }) {
    return (
        <div aria-label="file-browser" className="border-r border-(--du-bois-color-border) h-full min-w-[300px] p-1">
            <div className="items-center flex gap-1 h-8 justify-between w-full">
                <Button
                    aria-label="navigate-outside-of-folder"
                    className="rounded-sm h-6 w-6"
                    size="icon"
                    variant="ghost"
                >
                    <ArrowLeftIcon />
                </Button>
                <Typography className="mb-[2px]">
                    <Text bold>minidatabricks@databricks.com</Text>
                </Typography>
                <Button
                    aria-label="close-file-browser"
                    className="rounded-sm h-6 w-6"
                    onClick={onClose}
                    size="icon"
                    variant="ghost"
                >
                    <CloseIcon />
                </Button>
            </div>
            <div className="items-center flex gap-2 h-6 px-3">
                <FolderFillIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
                <Typography>
                    <Text className="mb-[2px]">Drafts</Text>
                </Typography>
            </div>
            { data.map((object, i) => {
                return (
                    <div className="items-center flex gap-2 h-6 px-3" key={i}>
                        {object.type === 'file' ? (
                            <FileIcon style={{ color: 'var(--du-bois-text-secondary)' }} />
                        ) : (
                            <FolderFillIcon style={{ color: 'var(--du-bois-color-blue-400)' }} />
                        )}
                        <Typography>
                            <Text className="mb-[2px]">{object.name}</Text>
                        </Typography>
                    </div>
                )
            }) }
        </div>
    )
}

export function Workspace() {
    const [showFileBrowser, setShowFileBrowser] = useState(false)
    
    return (
        <>
            <div aria-label="file browser" className="border-r border-(--du-bois-color-border) flex flex-col h-full">
                {/* Workspace menu */}
                <div className="flex flex-col gap-1 p-1">
                    <Button
                        aria-label="view-query-editor"
                        className="rounded-sm"
                        size="icon"
                        variant="ghost"
                    >
                        <QueryEditorIcon />
                    </Button>
                </div>
                <Separator />
                <div className="flex flex-col gap-1 p-1">
                    <Button
                        aria-label="view-file-browser"
                        className="rounded-sm"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowFileBrowser(!showFileBrowser)}
                    >
                        <FolderIcon />
                    </Button>
                    <Button
                        aria-label="view-catalog"
                        className="rounded-sm"
                        size="icon"
                        variant="ghost"
                    >
                        <DataIcon />
                    </Button>
                </div>
            </div>
            {showFileBrowser && <FileBrowser onClose={() => setShowFileBrowser(false)} />}
        </>
    )
}