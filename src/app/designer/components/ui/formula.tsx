"use client"

import React, { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormulaProps extends React.ComponentProps<"textarea"> {
    availableFields?: Array<{
        description?: string
        name: string
        type: string
    }>
}

const availableSQLFunctions = [{
    description: "Returns the absolute (positive) value of a number",
    function: "ABS"
}, {
    description: "Calculates the average value of a column across all rows",
    function: "AVG"
}, {
    description: "Rounds a number up to the nearest whole number",
    function: "CEIL"
}, {
    description: "Joins multiple text values together into one string",
    function: "CONCAT"
}, {
    description: "Counts the total number of rows in your data",
    function: "COUNT"
}, {
    description: "Counts rows that meet a specific condition you set",
    function: "COUNT_IF"
}, {
    description: "Rounds a number down to the nearest whole number",
    function: "FLOOR"
}, {
    description: "Converts all letters in text to lowercase",
    function: "LOWER"
}, {
    description: "Finds the largest value in a column across all rows",
    function: "MAX"
}, {
    description: "Finds the smallest value in a column across all rows",
    function: "MIN"
}, {
    description: "Replaces specific text with new text in a string",
    function: "REPLACE"
}, {
    description: "Rounds a number to a specified number of decimal places",
    function: "ROUND"
}, {
    description: "Extracts a portion of text from a larger string",
    function: "SUBSTRING"
}, {
    description: "Adds up all the values in a column across all rows",
    function: "SUM"
}, {
    description: "Removes extra spaces from the beginning and end of text",
    function: "TRIM"
}, {
    description: "Converts all letters in text to uppercase",
    function: "UPPER"
}]

function Formula({ availableFields = [], className, ...props }: FormulaProps) {
    const [filteredFields, setFilteredFields] = useState(availableFields)
    const [filteredFunctions, setFilteredFunctions] = useState(availableSQLFunctions)
    const [showDropdown, setShowDropdown] = useState(false)
    const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)
    const [value, setValue] = useState(props.value || "")

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        filterItems(newValue, e.target.selectionStart)
    }

    const filterItems = (text: string, cursorPosition: number) => {
        // Get text before cursor
        const textBeforeCursor = text.substring(0, cursorPosition)
        
        // Find the current word being typed (could be inside parentheses, after commas, etc.)
        const wordMatch = textBeforeCursor.match(/[a-zA-Z_][a-zA-Z0-9_]*$/)
        const currentWord = wordMatch ? wordMatch[0] : ""
        
        if (text.length > 0) {
            const filteredFieldsList = availableFields.filter(field =>
                field.name.toLowerCase().startsWith(currentWord.toLowerCase())
            )
            const filteredFunctionsList = availableSQLFunctions.filter(func =>
                func.function.toLowerCase().startsWith(currentWord.toLowerCase())
            )
            setFilteredFields(filteredFieldsList)
            setFilteredFunctions(filteredFunctionsList)
            setShowDropdown(filteredFieldsList.length > 0 || filteredFunctionsList.length > 0)
        } else {
            setShowDropdown(false)
        }
    }

    const insertItem = (itemName: string, isFunction: boolean = false) => {
        if (!textareaRef) return
        
        const cursorPosition = textareaRef.selectionStart
        
        const textBeforeCursor = value.substring(0, cursorPosition)
        const textAfterCursor = value.substring(cursorPosition)
        
        const wordMatch = textBeforeCursor.match(/[a-zA-Z_][a-zA-Z0-9_]*$/)
        const currentWord = wordMatch ? wordMatch[0] : ""
        const wordStart = currentWord ? textBeforeCursor.lastIndexOf(currentWord) : cursorPosition
        
        const newText = 
            value.substring(0, wordStart) + 
            itemName + (isFunction ? "(" : "") + 
            textAfterCursor
        
        setShowDropdown(false)
        setValue(newText)
    }

    return (
        <div aria-label="formula" className="relative">
            {/* <Label className="mb-2">Formula</Label> */}
            <Textarea
                className="font-mono !text-[13px]"
                onChange={handleTextareaChange}
                ref={setTextareaRef}
                value={value}
                {...props}
            />
            {showDropdown && (
                <div className="bg-white dark:bg-black rounded-md shadow-md cursor-pointer mt-1 max-h-100 overflow-y-scroll absolute top-full w-full z-1">
                    <div className="border-b text-muted-foreground text-xs px-2 py-1">Insert field or function</div>
                    <div>
                        {/* Show filtered fields */}
                        {filteredFields.map((field, index) => (
                            <div
                                className="items-center hover:bg-black/10 dark:hover:bg-white/10 flex gap-2 justify-between px-2 py-2"
                                key={field.name}
                                onClick={() => insertItem(field.name, false)}
                            >
                                <div className="text-blue-800 font-mono text-sm font-medium">{field.name}</div>
                                <div className="text-muted-foreground text-xs">{field.type} field</div>
                            </div>
                        ))}

                        {/* Show filtered functions */}
                        {filteredFunctions.map((func, index) => (
                            <div
                                className="items-center hover:bg-black/10 flex gap-2 justify-between px-2 py-2"
                                key={func.function}
                                onClick={() => insertItem(func.function, true)}
                            >
                                <div className="text-green-800 font-mono text-sm font-medium">{func.function}()</div>
                                <div className="text-muted-foreground text-xs">function</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export { Formula }
