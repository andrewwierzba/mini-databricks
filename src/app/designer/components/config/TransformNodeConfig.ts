"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { FunctionIcon, TrashIcon, Typography } from "@databricks/design-system"

import { Formula } from "@/app/designer/components/ui/formula"
import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import { ColumnType, TransformExpression, TransformNodeData } from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface TransformNodeConfigProps {
    nodeId: string
}

export function TransformNodeConfig({ nodeId }: TransformNodeConfigProps) {
    const {
        nodeData,
        addTransformExpression,
        updateTransformExpression,
        removeTransformExpression
    } = useNodeConfiguration(nodeId)

    const [editorPopover, setEditorPopover] = useState<string | null>(null)
    const [formulaValues, setFormulaValues] = useState<Record<string, string>>({})

    const transformData = nodeData as TransformNodeData | undefined
    const expressions = transformData?.expressions || []
    const availableColumns = transformData?.columnHeaders || []

    const availableFields = availableColumns.map(col => ({
        name: col,
        type: "string" // In real app, get actual type
    }))

    const handleAddExpression = () => {
        const newExpression: TransformExpression = {
            id: `expr-${Date.now()}`,
            expression: "",
            alias: "",
            type: undefined
        }
        addTransformExpression(newExpression)
    }

    const handleApplyFormula = (expressionId: string) => {
        const formula = formulaValues[expressionId] || ""
        updateTransformExpression(expressionId, { expression: formula })
        setEditorPopover(null)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div>
                <Typography>
                    <Text className="font-medium text-sm">Transform Configuration</Text>
                </Typography>
                <Typography>
                    <Paragraph className="text-gray-600 text-xs">
                        Create calculated columns using expressions
                    </Paragraph>
                </Typography>
            </div>

            {/* Expressions Table */}
            {expressions.length > 0 && (
                <div className="rounded-sm border overflow-hidden">
                    <Table className="text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-medium">Expression</TableHead>
                                <TableHead className="font-medium w-32">Type</TableHead>
                                <TableHead className="font-medium w-32">Alias</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expressions.map((expr) => (
                                <TableRow key={expr.id}>
                                    <TableCell>
                                        <div className="items-center flex gap-2">
                                            <div className="flex-1 font-mono text-xs truncate">
                                                {expr.expression || "No expression"}
                                            </div>
                                            <Popover 
                                                open={editorPopover === expr.id}
                                                onOpenChange={(open) => 
                                                    setEditorPopover(open ? expr.id : null)
                                                }
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        className="rounded-sm h-6 w-6"
                                                        size="icon"
                                                        variant="outline"
                                                    >
                                                        <FunctionIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent 
                                                    align="start"
                                                    className="p-0 w-[320px]"
                                                    side="right"
                                                    sideOffset={4}
                                                >
                                                    <div className="flex flex-col">
                                                        <div className="p-2">
                                                            <Typography>
                                                                <Text className="font-medium mb-1 text-sm">
                                                                    Expression Editor
                                                                </Text>
                                                            </Typography>
                                                            <Formula 
                                                                availableFields={availableFields}
                                                                className="mb-1"
                                                                value={formulaValues[expr.id] || expr.expression}
                                                                onChange={(e) => {
                                                                    setFormulaValues({
                                                                        ...formulaValues,
                                                                        [expr.id]: e.target.value
                                                                    })
                                                                }}
                                                            />
                                                        </div>
                                                        <Separator />
                                                        <div className="flex gap-2 justify-end p-2">
                                                            <Button
                                                                onClick={() => setEditorPopover(null)}
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleApplyFormula(expr.id)}
                                                                size="sm"
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={expr.type || "string"}
                                            onValueChange={(value) => 
                                                updateTransformExpression(expr.id, { 
                                                    type: value as ColumnType 
                                                })
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
                                            placeholder="Alias"
                                            value={expr.alias}
                                            onChange={(e) => 
                                                updateTransformExpression(expr.id, { 
                                                    alias: e.target.value 
                                                })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            className="rounded-sm h-6 w-6"
                                            onClick={() => removeTransformExpression(expr.id)}
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Add Expression Button */}
            <Button
                className="rounded-sm w-fit"
                onClick={handleAddExpression}
                size="sm"
                variant="outline"
            >
                Add expression
            </Button>

            {/* Preview Summary */}
            {transformData?.recordCount !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Preview:</span>
                    <span>
                        {transformData.previewData?.length || 0} of {transformData.recordCount} rows
                    </span>
                </div>
            )}
        </div>
    )
}
