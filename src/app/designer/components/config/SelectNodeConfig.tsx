"use client"

import React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Typography } from "@databricks/design-system"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { ColumnType, SelectNodeData } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface SelectNodeConfigProps {
    nodeId: string
}

export function SelectNodeConfig({ nodeId }: SelectNodeConfigProps) {
    const {
        nodeData,
        toggleSelectColumn,
        renameSelectColumn,
        updateSelectColumns
    } = useNodeConfiguration(nodeId)

    const selectData = nodeData as SelectNodeData | undefined
    const columns = selectData?.columns || []

    const handleToggleAll = () => {
        const allSelected = columns.every(c => c.selected)
        const updatedColumns = columns.map(c => ({ ...c, selected: !allSelected }))
        updateSelectColumns(updatedColumns)
    }

    const handleTypeChange = (columnName: string, type: ColumnType) => {
        const updatedColumns = columns.map(c => 
            c.name === columnName ? { ...c, type } : c
        )
        updateSelectColumns(updatedColumns)
    }

    const allSelected = columns.length > 0 && columns.every(c => c.selected)
    const someSelected = columns.some(c => c.selected) && !allSelected

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Select Columns</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Select fields to include, exclude, or rename
                    </Paragraph>
                </Typography>
            </div>

            {/* Columns Table */}
            <div className="rounded-sm border overflow-hidden">
                <Table className="text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox 
                                    checked={allSelected}
                                    onCheckedChange={handleToggleAll}
                                    aria-label="select-all"
                                    className={someSelected ? "data-[state=checked]:bg-gray-400" : ""}
                                />
                            </TableHead>
                            <TableHead className="font-medium">Column name</TableHead>
                            <TableHead className="font-medium">Type</TableHead>
                            <TableHead className="font-medium">Rename</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {columns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500">
                                    No columns available
                                </TableCell>
                            </TableRow>
                        ) : (
                            columns.map((column) => (
                                <TableRow key={column.name}>
                                    <TableCell>
                                        <Checkbox 
                                            checked={column.selected}
                                            onCheckedChange={() => toggleSelectColumn(column.name)}
                                            aria-label={`select-${column.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono">
                                        {column.name}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={column.type || "string"}
                                            onValueChange={(value) => 
                                                handleTypeChange(column.name, value as ColumnType)
                                            }
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="boolean">boolean</SelectItem>
                                                <SelectItem value="date">date</SelectItem>
                                                <SelectItem value="datetime">datetime</SelectItem>
                                                <SelectItem value="float">float</SelectItem>
                                                <SelectItem value="integer">integer</SelectItem>
                                                <SelectItem value="string">string</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            className="h-8"
                                            placeholder="New name"
                                            value={column.alias || ""}
                                            onChange={(e) => 
                                                renameSelectColumn(column.name, e.target.value)
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Preview Summary */}
            {selectData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {selectData.previewData?.length || 0} of {selectData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
