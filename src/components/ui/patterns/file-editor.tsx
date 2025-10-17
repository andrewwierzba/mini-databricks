"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { ArrowLeftIcon, CloseIcon, ColumnSplitIcon, DataIcon, FileCodeIcon, FileIcon, FolderIcon, FolderFillIcon, QueryEditorIcon, Typography } from "@databricks/design-system"

const { Hint, Paragraph, Text, Title } = Typography

interface EditorTabProps {
    isActive?: boolean
    label?: string
}

export function EditorTab({ isActive = false, label = "Tab" }: EditorTabProps) {
    return (
        <div
            aria-label="editor-tab"
            className={`group items-center border-r border-(--du-bois-color-border) pointer flex gap-1 px-2 py-2 ${
                isActive ? "bg-(--du-bois-color-background-primary)" : "hover:bg-accent border-b"
            }`}
        >
            <FileCodeIcon
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                style={{
                    color: 'var(--du-bois-color-text-secondary)'
                }}
            />
            <Text className="pointer-events-none">{label}</Text>
            <Tooltip>
                <TooltipTrigger className={`h-6 w-6 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <Button
                        aria-label="close-editor-tab"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <CloseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <Typography>
                        <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                            Close
                        </Paragraph>
                    </Typography>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

interface EditorTabsProps {
    activeTabIndex?: number
    tabs?: string[]
}

export function EditorTabs({ activeTabIndex = 0, tabs = ["query-1.sql", "query-2.sql"] }: EditorTabsProps) {
    return (
        <div
            aria-label="tabs"
            className="bg-(--du-bois-color-background-secondary) flex w-full"
        >
            {tabs.map((tab, index) => (
                <EditorTab
                    isActive={index === activeTabIndex}
                    key={index}
                    label={tab}
                />
            ))}
            <div className="items-center border-b border-(--du-bois-color-border) flex flex-1 h-full justify-end px-2">
                <Tooltip>
                    <TooltipTrigger className="h-6 w-6">
                        <Button
                            aria-label="editor-split-view"
                            className="rounded-sm h-6 w-6"
                            size="icon"
                            variant="ghost"
                        >
                            <ColumnSplitIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <Typography>
                            <Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
                                Split editor right
                            </Paragraph>
                        </Typography>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}

export function FileEditor() {    
    return (
        <div aria-label="editor" className="flex">
            <EditorTabs />
            <div
                aria-label="editor-content"
                className="bg-(--du-bois-color-background-primary) h-full"
            >
            </div>
        </div>
    )
}