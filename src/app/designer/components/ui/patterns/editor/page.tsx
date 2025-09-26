"use client"

import React, { useState } from "react"

{/* Shadcn components */}
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

{/* Databricks components */}
import { CloseIcon } from "@databricks/design-system"

{/* App components */}
import { Formula } from "@/app/designer/components/ui/formula"

interface PageProps {
    availableFields?: Array<{
        description?: string
        name: string
        type: string
    }>
}

export default function Editor({ availableFields = [] }: PageProps) {
    const [aiFormula, setAiFormula] = useState(false)
    const [formulaValue, setFormulaValue] = useState("")

    return (
        <div className="flex flex-col gap-2">
            <Formula 
                availableFields={availableFields}
            />
            {!aiFormula ? (
                <Button
                    className="w-fit"
                    onClick={() => setAiFormula(true)}
                    size="sm"
                    variant="outline"
                >
                    Create formula with AI
                </Button>
            ) : (
                <div className="relative">
                    <Textarea className="min-h-[90px] resize-none" placeholder="Count the number of resolved cases" />
                    <Button
                        className="rounded-sm h-6 absolute right-2 top-2 w-6"
                        onClick={() => setAiFormula(false)}
                        size="icon"
                        variant="ghost"
                    >
                        <CloseIcon />
                    </Button>
                    <Button
                        className="bottom-2 rounded-sm absolute right-2"
                        onClick={() => {
                            setFormulaValue("100 * COUNT_IF(status = 'resolved') / COUNT(*) AS 'percent_resolved'")
                            setAiFormula(false)
                        }}
                        size="sm"
                        variant="outline"
                    >
                        Create formula
                    </Button>
                </div>
            )}
        </div>
    )
}