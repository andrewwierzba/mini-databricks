"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { OverflowIcon, PlayIcon, TrashIcon, Typography } from "@databricks/design-system"

const { Paragraph, Text } = Typography

interface NotebookCellProps {
	content?: string
	id?: string
	isActive?: boolean
	metadata?: Record<string, unknown>
	onChange?: (value: string) => void
	onClick?: () => void
	outputs?: {
		content: string
		type: "display_data" | "error" | "stream"
	}[]
	type?: "code" | "markdown"
}

function NotebookCell({ content, id, isActive, metadata, onChange, onClick, outputs, type }: NotebookCellProps) {
	return (
		<div
			aria-label="notebook-cell"
			className="cursor-pointer text-sm relative"
			onClick={onClick}
		>
			<div className={`border rounded-sm ${isActive ? "border-(--du-bois-color-blue-600) border-2" : "border-(--du-bois-color-border)"} bottom-0 left-0 pointer-events-none absolute right-0 top-0`} />
			<div className="flex flex-col gap-2 p-2">
				<div className="items-center flex justify-between">
					<Button className="bg-(--du-bois-color-blue-600) rounded-sm h-6 pl-1.5 pr-3" size="sm">
						<PlayIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
						<span>Run cell</span>
					</Button>
					<span aria-label="notebook-cell-index" className="text-(--du-bois-color-text-secondary)">
						{id}
					</span>
					<div className="flex gap-2">
						<Tooltip>
							<TooltipTrigger className="h-6 w-6">
								<Button
									aria-label="delete-notebook-cell"
									className="rounded-sm h-6 w-6"
									size="icon"
									variant="ghost"
								>
									<TrashIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<Typography>
									<Paragraph style={{ color: 'var(--du-bois-text-white)' }}>
										Delete cell
									</Paragraph>
								</Typography>
							</TooltipContent>
						</Tooltip>
						<Button
							className="rounded-sm h-6 w-6"
							size="icon"
							variant="ghost"
						>
							<OverflowIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
						</Button>
					</div>
				</div>
			<textarea
				aria-label="notebook-cell-content"
				className="flex-1 font-mono text-xs h-full min-h-0 outline-none resize-none whitespace-pre w-full"
				onChange={(e) => onChange?.(e.target.value)}
				rows={1}
				value={content}
			/>
			</div>
			{outputs && outputs.length > 0 && (
				<div aria-label="notebook-cell-output" className="border-t border-(--du-bois-color-border) p-2">
					{outputs.map((output, index) => (
						<div key={index}>{output.content}</div>
					))}
				</div>
			)}
		</div>
	)
}

interface NotebookMenuItem {
	name: string
}

interface NotebookMenuGroup {
	label?: string
	items: NotebookMenuItem[]
}

interface NotebookMenuBarItemProps {
	groups?: NotebookMenuGroup[]
	name: string
}

function NotebookMenuBarItem({ groups, name }: NotebookMenuBarItemProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					aria-label={`notebook-menu-bar-item-${name}`}
					className="hover:bg-accent rounded-xs cursor-pointer px-2 py-0.5"
				>
					{name}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{groups?.map((group, groupIndex) => (
					<div key={groupIndex}>
						{groupIndex > 0 && <DropdownMenuSeparator />}
						<DropdownMenuGroup>
							{group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
							{group.items.map((item) => (
								<DropdownMenuItem key={item.name}>
									{item.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

interface NotebookMenuBarProps {
	items: {
		groups?: NotebookMenuGroup[]
		name: string
	}[]
}

function NotebookMenuBar({ items }: NotebookMenuBarProps) {
	return (
		<div aria-label="notebook-menu-bar" className="border-b border-(--du-bois-color-border) flex text-sm gap-1 p-1">
			{items?.map((item) => (
				<NotebookMenuBarItem key={item.name} groups={item.groups} name={item.name} />
			))}
		</div>
	)
}

export function NotebookEditor() {
	const [activeCellId, setActiveCellId] = useState<string | null>(null)
	const [cells, setCells] = useState({
		"cell-1": "print('Hello, world!')",
		"cell-2": "%md Hello, world!",
	})

	const handleCellChange = (cellId: string, value: string) => {
		setCells(prev => ({ ...prev, [cellId]: value }))
	}

	return (
		<div>
			<NotebookMenuBar
				items={[
					{
						name: "File",
						groups: [
							{
								items: [{ name: "New notebook" }, { name: "Open notebook" }],
							},
							{
								items: [{ name: "Save" }],
							},
						],
					},
					{
						name: "Edit",
						groups: [
							{
								items: [
									{ name: "Undo" },
									{ name: "Redo" },
								],
							},
							{
								items: [
									{ name: "Cut" },
									{ name: "Copy" },
									{ name: "Paste" },
								],
							},
						],
					},
					{
						name: "View",
						groups: [
							{
								items: [{ name: "Appearance" }, { name: "Editor layout" }],
							},
						],
					},
					{
						name: "Run",
						groups: [
							{
								items: [{ name: "Run cell" }, { name: "Run all" }],
							},
						],
					},
					{
						name: "Help",
						groups: [
							{
								items: [{ name: "Keyboard shortcuts" }],
							},
							{
								items: [{ name: "Documentation" }],
							},
						],
					},
				]}
			/>
			<div className="flex flex-col gap-4 p-4">
				<NotebookCell
					content={cells["cell-1"]}
					id="cell-1"
					isActive={activeCellId === "cell-1"}
					onChange={(value) => handleCellChange("cell-1", value)}
					onClick={() => setActiveCellId("cell-1")}
					outputs={[
						{
							content: "Hello, world!",
							type: "display_data",
						},
					]}
					type="code"
				/>
				<NotebookCell
					content={cells["cell-2"]}
					id="cell-2"
					isActive={activeCellId === "cell-2"}
					onChange={(value) => handleCellChange("cell-2", value)}
					onClick={() => setActiveCellId("cell-2")}
					type="markdown"
					outputs={[
						{
							content: "Hello, world!",
							type: "display_data",
						},
					]}
				/>
			</div>
		</div>
	)
}

