"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { NotebookEditor } from "@/components/ui/patterns/notebook-editor"

import { CloseSmallIcon, ColumnSplitIcon, FileCodeIcon, Typography } from "@databricks/design-system"

const { Paragraph, Text } = Typography

interface EditorTabProps {
	isActive?: boolean
	label?: string
	onClick?: () => void
}

export function EditorTab({ isActive = false, label = "Tab", onClick }: EditorTabProps) {
	return (
		<div
			aria-label="editor-tab"
			className={`group items-center border-r border-(--du-bois-color-border) cursor-pointer flex gap-1 px-2 py-2 ${
				isActive ? "bg-(--du-bois-color-background-primary)" : "hover:bg-accent border-b"
			}`}
			onClick={onClick}
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
				<TooltipTrigger
					className={`h-6 w-6 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
					onClick={(e) => e.stopPropagation()}
				>
					<Button
						aria-label="close-editor-tab"
						className="rounded-sm h-6 w-6"
						size="icon"
						variant="ghost"
					>
						<CloseSmallIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
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
	onTabClick?: (index: number) => void
	tabs?: string[]
}

export function EditorTabs({ activeTabIndex = 0, onTabClick, tabs = ["query-1.sql", "query-2.sql"] }: EditorTabsProps) {
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
					onClick={() => onTabClick?.(index)}
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

interface FileTab {
	content: string
	filename: string
}

type IndentType = "spaces" | "tabs"
type IndentSize = 2 | 4

function getFileType(filename: string): string {
	const extension = filename.split('.').pop()?.toLowerCase()
	const typeMap: Record<string, string> = {
		js: "JavaScript",
		jsx: "JavaScript",
		json: "JSON",
		ipynb: "Jupyter Notebook",
		md: "Markdown",
		py: "Python",
		sql: "SQL",
		ts: "TypeScript",
		tsx: "TypeScript",
		txt: "Text",
	}
    
	return typeMap[extension || ""] || "Plain Text"
}

function isNotebookFile(filename: string): boolean {
	return filename.toLowerCase().endsWith('.ipynb')
}

function parseNotebook(content: string): NotebookData | null {
	try {
		return JSON.parse(content) as NotebookData
	} catch {
		return null
	}
}

export function FileEditor() {
	const [activeTabIndex, setActiveTabIndex] = useState(0)
	const [cursorPosition, setCursorPosition] = useState({ column: 1, line: 1 })
	const [indentSize, setIndentSize] = useState<IndentSize>(4)
	const [indentType, setIndentType] = useState<IndentType>("spaces")
	const [selectedLength, setSelectedLength] = useState(0)

	const [fileTabs, setFileTabs] = useState<FileTab[]>([
		{
			content: "-- Sample SQL query\nSELECT * FROM users WHERE active = true;",
			filename: "query-1.sql",
		},
		{
			content: "# Sample Markdown\n\nThis is a **markdown** file with _formatting_.",
			filename: "README.md",
		},
		{
			content: "// Sample JavaScript\nfunction hello() {\n  console.log('Hello, world!');\n}",
			filename: "script.js",
		},
		{
			content: "# Sample Python\ndef greet(name):\n    print(f'Hello, {name}!')",
			filename: "script.py",
		},
		{
			content: JSON.stringify({
				cells: [
					{
						id: "cell-1",
						type: "markdown",
						source: "# Sample Notebook\n\nThis is a Jupyter-style notebook with interactive cells.",
					},
					{
						id: "cell-2",
						type: "code",
						source: "# Sample Python code\nimport pandas as pd\nimport numpy as np\n\nprint('Hello from notebook!')",
						execution_count: null,
						outputs: [],
					},
					{
						id: "cell-3",
						type: "code",
						source: "# Calculate something\ndata = [1, 2, 3, 4, 5]\nresult = sum(data)\nprint(f'Sum: {result}')",
						execution_count: null,
						outputs: [],
					},
				],
				metadata: {
					kernelspec: {
						display_name: "Python 3",
						language: "python",
						name: "python3",
					},
					language_info: {
						name: "python",
						version: "3.11.0",
					},
				},
				nbformat: 4,
				nbformat_minor: 4,
			}),
			filename: "analysis.ipynb",
		},
	])

	const updateFileContent = (index: number, newContent: string) => {
		setFileTabs((prev) =>
			prev.map((tab, i) => (i === index ? { ...tab, content: newContent } : tab))
		)
	}

	const updateNotebookContent = (index: number, notebook: NotebookData) => {
		updateFileContent(index, JSON.stringify(notebook, null, 2))
	}

	const updateCursorPosition = (textarea: HTMLTextAreaElement) => {
		const content = textarea.value
		const cursorPos = textarea.selectionStart
		const selectionEnd = textarea.selectionEnd
		const textBeforeCursor = content.substring(0, cursorPos)
		const lines = textBeforeCursor.split('\n')
		const line = lines.length
		const column = lines[lines.length - 1].length + 1

		setCursorPosition({ column, line })
		setSelectedLength(selectionEnd - cursorPos)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault()
			const textarea = e.currentTarget

			const currentContent = fileTabs[activeTabIndex].content
			const end = textarea.selectionEnd
			const start = textarea.selectionStart

			const indentChar = indentType === "tabs" ? "\t" : " ".repeat(indentSize)

			const newContent =
				currentContent.substring(0, start) +
				indentChar +
				currentContent.substring(end)

			updateFileContent(activeTabIndex, newContent)

			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + (indentType === "tabs" ? 1 : indentSize)
				updateCursorPosition(textarea)
			}, 0)
		}
	}

	const currentFile = fileTabs[activeTabIndex]
	const isNotebook = isNotebookFile(currentFile.filename)
	const notebookData = isNotebook ? parseNotebook(currentFile.content) : null

	return (
		<div aria-label="editor" className="flex flex-col h-full w-full">
			<EditorTabs
				activeTabIndex={activeTabIndex}
				onTabClick={setActiveTabIndex}
				tabs={fileTabs.map((tab) => tab.filename)}
			/>
			{isNotebook && notebookData ? (
				<NotebookEditor />
			) : (
				<>
					<div
						aria-label="editor-content"
						className="bg-(--du-bois-color-background-primary) flex flex-1 font-mono text-[13px] h-full overflow-hidden p-4"
					>
						<div
							aria-label="editor-line-count"
							className="text-(--du-bois-color-text-secondary) pr-4 text-right"
						>
							{fileTabs[activeTabIndex].content.split('\n').map((_, index) => (
								<div key={index}>{index + 1}</div>
							))}
						</div>
						<textarea
							aria-label="editor-content-value"
							className="flex-1 h-full min-h-0 outline-none resize-none whitespace-pre w-full"
							onChange={(e) => {
								updateCursorPosition(e.target)
								updateFileContent(activeTabIndex, e.target.value)
							}}
							onClick={(e) => updateCursorPosition(e.currentTarget)}
							onKeyDown={handleKeyDown}
							onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
							onSelect={(e) => updateCursorPosition(e.currentTarget)}
							value={fileTabs[activeTabIndex].content}
						/>
					</div>
				</>
			)}
			<div aria-label="editor-bar" className="border-t border-(--du-bois-color-border) flex text-xs justify-end w-full">
				<div aria-label="editor-line-column-position" className="hover:bg-accent px-2 py-1">
					Ln {cursorPosition.line}, Col {cursorPosition.column}{selectedLength > 0 && ` (${selectedLength} selected)`}
				</div>
				<div
					aria-label="editor-indentation"
					className="hover:bg-accent cursor-pointer px-2 py-1"
				>
					{indentType === "spaces" ? "Spaces" : "Tabs"}: {indentSize}
				</div>
				<div aria-label="editor-file-type" className="hover:bg-accent px-2 py-1">
					{getFileType(fileTabs[activeTabIndex].filename)}
				</div>
			</div>
			<div aria-label="query" className="border-t border-(--du-bois-color-border) flex flex-col text-[13px] min-h-[180px]">
				<div aria-label="" className="flex gap-2 px-2 py-1">
					<div aria-label="" className="flex">
						<div className="items-center hover:bg-accent rounded-sm flex px-2 py-1 relative after:bg-(--du-bois-color-blue-600) after:-bottom-1 after:content-[''] after:h-[2px] after:left-0 after:absolute after:right-0">Results</div>
						<div className="items-center hover:bg-accent rounded-sm flex px-2 py-1">Charts</div>
					</div>
					<div className="flex flex-1 justify-end">
						<Button
							aria-label="run-query"
							className="rounded-sm text-[13px] h-8 px-3"
							size="sm"
						>
							Run ⌘ ⏎
						</Button>
					</div>
				</div>
				<div aria-label="query-result" className="bg-(--du-bois-color-background-secondary) border-t border-(--du-bois-color-border) p-4">
					Click <span className="bg-gray-200 rounded-sm px-1 py-[2px]">Run</span> to execute your query.
				</div>
			</div>
		</div>
	)
}