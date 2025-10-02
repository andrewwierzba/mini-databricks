"use client"

import React from "react"

import { DashIcon, PlusIcon, ResizeIcon, Typography } from "@databricks/design-system"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { useNodeConfiguration } from "@/app/designer/hooks/useNodeConfiguration"
import {
    getNodeTypeById,
    JoinCondition,
    JoinNodeData,
    JoinOperator,
    JoinType
} from "@/app/designer/types/nodes"

const { Paragraph, Text } = Typography

interface JoinNodeConfigProps {
    nodeId: string
}

export function JoinNodeConfig({ nodeId }: JoinNodeConfigProps) {
    const {
        nodeData,
        addJoinCondition,
        updateJoinCondition,
        removeJoinCondition,
        updateJoinType
    } = useNodeConfiguration(nodeId)

    const nodeTypeConfig = getNodeTypeById("join")
    const description = nodeTypeConfig?.description || ""

    const joinData = nodeData as JoinNodeData | undefined

    const availableColumns = joinData?.availableColumns || []
    const conditions = joinData?.conditions || []

    const handleAddCondition = () => {
        const newCondition: JoinCondition = {
            id: `condition-${Date.now()}`,
            leftColumn: "",
            operator: "=",
            rightColumn: ""
        }

        addJoinCondition(newCondition)
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Heading */}
            <div>
                <Typography>
                    <Text style={{ fontWeight: 600 }}>
                        Join
                    </Text>
                </Typography>
                <Typography>
                    <Paragraph style={{ color: "var(--color-gray-600)" }}>
                        {description}
                    </Paragraph>
                </Typography>
            </div>

            {/* Join type */}
            <div>
                <Typography>
                    <Text style={{ fontWeight: 600 }}>
                        Join type
                    </Text>
                </Typography>
                <Select
                    onValueChange={(value) => updateJoinType(value as JoinType)}
                    value={joinData?.joinType || "inner"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select join type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inner">Inner Join</SelectItem>
                        <SelectItem value="left">Left Join</SelectItem>
                        <SelectItem value="right">Right Join</SelectItem>
                        <SelectItem value="full">Full Outer Join</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Join conditions */}
            <div>
                <Typography>
                    <Text style={{ fontWeight: 600 }}>
                        Join condtions
                    </Text>
                </Typography>
                <div className="flex flex-col">
                    {conditions.map((condition, index) => (
                        <>
                            {/* Conditions */}
                            <div className="items-center flex gap-2 mb-2" key={condition.id}>

                                {/* Left table column */}
                                <div className="flex-1">
                                    <Select
                                        onValueChange={(value) =>
                                            updateJoinCondition(condition.id, { leftColumn: value })
                                        }
                                        value={condition.leftColumn}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColumns.length === 0 ? (
                                                <SelectItem value="_none" disabled>
                                                    No available columns
                                                </SelectItem>
                                            ) : (
                                                availableColumns.map(column => (
                                                    <SelectItem key={column.name} value={column.name}>
                                                        {column.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="h-6 shrink-0 text-center w-6">
                                    <ResizeIcon
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                        style={{
                                            color: "var(--color-gray-400)"
                                        }}
                                    />
                                </div>

                                {/* Right table column */}
                                <div className="flex-1">
                                    <Select
                                        onValueChange={(value) =>
                                            updateJoinCondition(condition.id, { rightColumn: value })
                                        }
                                        value={condition.rightColumn}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select column" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableColumns.length === 0 ? (
                                                <SelectItem value="_none" disabled>
                                                    No available columns
                                                </SelectItem>
                                            ) : (
                                                availableColumns.map(column => (
                                                    <SelectItem key={column.name} value={column.name}>
                                                        {column.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remove condition */}
                                <Button
                                    className="rounded-sm h-8 shrink-0 w-8"
                                    onClick={() => removeJoinCondition(condition.id)}
                                    size="icon"
                                    variant="ghost"
                                >
                                    <DashIcon onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
                                </Button>
                            </div>

                            {conditions.length > 0
                                && conditions.length !== index + 1
                                && (
                                <Separator className="mb-2" />
                            )}
                        </>
                    ))}
                </div>

                {/* Add condition */}
                <Button
                    className="rounded-sm w-fit"
                    onClick={handleAddCondition}
                    size="sm"
                    variant="outline"
                >
                    <PlusIcon
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        style={{
                            color: "var(--color-gray-400)"
                        }}
                    /> Add condition
                </Button>
            </div>

            {/* Join columns */}
            <div>
                <Typography>
                    <Text style={{ fontWeight: 600 }}>
                        Select columns
                    </Text>
                </Typography>
                <div className="rounded-sm border overflow-hidden">
                    <Table className="text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox aria-label="select-all" />
                                </TableHead>
                                <TableHead className="font-medium">Column name</TableHead>
                                <TableHead className="font-medium">Type</TableHead>
                                <TableHead className="font-medium">Rename</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableColumns.length === 0 ? (
                                <TableRow>
                                    <TableCell className="text-center text-gray-400" colSpan={4} >
                                        No columns available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                availableColumns.map((column) => (
                                    <TableRow key={column.name}>
                                        <TableCell>
                                            <Checkbox aria-label={`select-${column.name}`} />
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {column.name}
                                        </TableCell>
                                        <TableCell>
                                            <Select value={column.type || "string"}>
                                                <SelectTrigger>
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
                                            <Input value={column.alias || ""} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Preview summary */}
            {joinData?.dataPreview !== undefined && (
                <div className="bg-gray-100 rounded-sm text-gray-600 flex text-xs gap-2 justify-between p-2">
                    <span className="font-medium">Output preview:</span>
                    <span>
                        {joinData.dataPreview?.length || 0} of {joinData.dataPreview?.length} rows
                    </span>
                </div>
            )}
        </div>
    )
}
