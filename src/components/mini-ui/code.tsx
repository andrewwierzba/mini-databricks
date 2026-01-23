"use client";

import { useEffect, useState } from "react";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

import { CurlyBraces } from "lucide-react";

export interface LineHighlight {
    line: number;
    color: string;
}

export interface Props {
    className?: string;
    disabled?: boolean;
    lineCount?: boolean;
    lineHighlights?: LineHighlight[];
    type: "sql" | "notebook" | "python" | "yaml";
    value: string;
    addedLines?: number[];
    removedLines?: number[];
}

export interface ExtendedProps extends Props {
    onChange?: (value: string) => void;
}

/**
 * Code component with syntax highlighting and diff support
 * Supports SQL, Python, and notebook types with optional line highlighting
 */
export function Code({
    className,
    disabled = false,
    lineCount = false,
    lineHighlights = [],
    type = "sql",
    value,
    onChange,
    addedLines = [],
    removedLines = [],
}: ExtendedProps) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Standard diff colors: green for added, red for removed
    const DIFF_COLORS = {
        added: "#ecfdf5",    // Light green background
        removed: "#fff1f2",  // Light red background
    };

    /**
     * Get the Prism language based on type
     */
    const getPrismLanguage = () => {
        return type === "sql" ? Prism.languages.sql : Prism.languages.python;
    };

    /**
     * Highlight code with syntax highlighting only
     */
    const highlightCode = (code: string) => {
        const language = getPrismLanguage();
        return Prism.highlight(code, language, type === "sql" ? "sql" : "python");
    };

    /**
     * Highlight code with line-based highlighting (custom highlights, diff, etc.)
     */
    const highlightCodeWithLines = (code: string) => {
        const codeLines = code.split('\n');
        const language = getPrismLanguage();
        
        return codeLines.map((line, index) => {
            const lineNumber = index + 1;
            
            // Priority: 1. Custom lineHighlights, 2. Diff highlighting
            const customHighlight = lineHighlights.find(h => h.line === lineNumber);
            let bgColor = 'transparent';
            
            if (customHighlight && line.trim() !== '') {
                // Custom highlight takes priority
                bgColor = customHighlight.color;
            } else {
                // Check for diff highlighting
                if (addedLines.includes(lineNumber)) {
                    bgColor = DIFF_COLORS.added;
                } else if (removedLines.includes(lineNumber)) {
                    bgColor = DIFF_COLORS.removed;
                }
            }
            
            const highlightedLine = Prism.highlight(line, language, type === "sql" ? "sql" : "python");
            
            return `<span style="display: block; background-color: ${bgColor}; padding: 0; margin: 0; line-height: 1.5; white-space: pre;">${highlightedLine || '\u00A0'}</span>`;
        }).join('');
    };

    const handleChange = (newValue: string) => {
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const lines = localValue.split('\n');
    const hasDiffHighlighting = addedLines.length > 0 || removedLines.length > 0;
    const needsLineHighlighting = lineHighlights.length > 0 || hasDiffHighlighting;

    /**
     * Calculate the displayed line number accounting for removed lines
     * Removed lines don't get a line number, so subsequent lines shift up
     */
    const getDisplayLineNumber = (originalLineNumber: number): number | null => {
        if (removedLines.includes(originalLineNumber)) {
            return null; // Don't show line number for removed lines
        }
        
        // Count how many removed lines come before this line
        const removedBefore = removedLines.filter(line => line < originalLineNumber).length;
        return originalLineNumber - removedBefore;
    };

    return (
        <div className={`flex flex-col min-w-0 ${className}`}>
            <div className="flex gap-4 p-2 min-w-0">
                {lineCount && (
                    <div
                        aria-label="line-count"
                        className="text-gray-500 font-mono text-[13px] text-right select-none"
                        style={{ lineHeight: '1.5' }}
                    >
                        {lines.map((_, index) => {
                            const originalLineNumber = index + 1;
                            const displayLineNumber = getDisplayLineNumber(originalLineNumber);
                            
                            // Don't show line number for removed lines - render empty div to maintain alignment
                            if (displayLineNumber === null) {
                                return <div key={index}>&nbsp;</div>;
                            }
                            
                            return (
                                <div key={index}>
                                    {displayLineNumber}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="flex-1 relative overflow-x-auto">
                    <Editor
                        value={localValue}
                        onValueChange={handleChange}
                        highlight={needsLineHighlighting ? highlightCodeWithLines : highlightCode}
                        padding={0}
                        disabled={disabled}
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 13,
                            lineHeight: '1.5',
                            outline: 'none',
                            minHeight: '100%',
                            width: '100%',
                            whiteSpace: 'pre',
                        }}
                        textareaClassName="outline-none resize-none whitespace-pre"
                        preClassName="m-0 whitespace-pre"
                    />
                </div>
            </div>
            <div aria-label="code-configuration" className="items-center bg-gray-50 border-gray-200 border-t-1 text-gray-400 flex justify-between px-2 w-full">
                <div />
                <div className="items-center flex gap-2">
                    <button className="items-center hover:bg-black/5 flex px-0.5">
                        <CurlyBraces className="h-3 w-3" />
                        <span className="text-xs p-0.5">{type === "sql" ? "SQL" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
