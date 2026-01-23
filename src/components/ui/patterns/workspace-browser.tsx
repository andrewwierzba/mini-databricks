"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { ArrowLeftIcon, CloseIcon, DataIcon, FileIcon, FolderIcon, FolderFillIcon, QueryEditorIcon } from "@databricks/design-system"


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
        <div aria-label="file-browser" className="border-r border-(--du-bois-color-border) h-full p-1 w-[320px]">
            <div className="items-center flex gap-1 h-8 justify-between w-full">
                <Button
                    aria-label="navigate-outside-of-folder"
                    className="rounded-sm h-6 w-6"
                    size="icon"
                    variant="ghost"
                >
                    <ArrowLeftIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Button>
                <span className="text-[13px] font-bold mb-[2px]">minidatabricks@databricks.com</span>
                <Button
                    aria-label="close-file-browser"
                    className="rounded-sm h-6 w-6"
                    onClick={onClose}
                    size="icon"
                    variant="ghost"
                >
                    <CloseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Button>
            </div>
            <div className="items-center flex gap-2 h-6 px-3">
                <FolderFillIcon style={{ color: 'var(--du-bois-text-secondary)' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                <span className="text-[13px] mb-[2px]">Drafts</span>
            </div>
            { data.map((object, i) => {
                return (
                    <div className="items-center flex gap-2 h-6 px-3" key={i}>
                        {object.type === 'file' ? (
                            <FileIcon style={{ color: 'var(--du-bois-text-secondary)' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        ) : (
                            <FolderFillIcon style={{ color: 'var(--du-bois-color-blue-400)' }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        )}
                        <span className="text-[13px] mb-[2px]">{object.name}</span>
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
                        className="rounded-sm h-8 w-8"
                        size="icon"
                        variant="ghost"
                    >
                        <QueryEditorIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Button>
                </div>
                <Separator />
                <div className="flex flex-col gap-1 p-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                aria-label="view-file-browser"
                                className="rounded-sm h-8 w-8"
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowFileBrowser(!showFileBrowser)}
                            >
                                <FolderIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                Workspace (Ctrl + Option + E)
                            </span>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                aria-label="view-catalog"
                                className="rounded-sm h-8 w-8"
                                size="icon"
                                variant="ghost"
                            >
                                <DataIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <span style={{ color: 'var(--du-bois-text-white)' }}>
                                Catalog (Ctrl + Option + C)
                            </span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            {showFileBrowser && <FileBrowser onClose={() => setShowFileBrowser(false)} />}
        </>
    )
}