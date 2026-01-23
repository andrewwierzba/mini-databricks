"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, Copy, Info, TerminalSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Code } from "@/components/mini-ui/code";

export interface ConditionProps {
    category?: string;
    description?: string;
    label: string;
    type: "sql" | "python";
    value: string;
}

export interface ConditionPropsExtended extends ConditionProps {
    onClick?: (condition: ConditionProps) => void;
}

export function Condition({
    category,
    description,
    label,
    type,
    value,
    onClick
}: ConditionPropsExtended) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        onClick?.({ label, type, value, category, description });
    };

    return (
        <div
            aria-label="condition"
            className="hover:bg-neutral-50 border-t-1 border-neutral-200 first:border-t-0 flex flex-col gap-2 px-3 py-2"
            onClick={handleClick}
        >
            <div className="items-center flex gap-2 justify-between">
                <div className="items-center flex flex-1 gap-2 min-w-0">
                    <div className="bg-neutral-200 rounded-sm flex-shrink-0 p-1">
                        <TerminalSquare className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold min-w-0 truncate">{label}</span>
                </div>
                <Button
                    className="border-neutral-200 rounded-[4px] h-6 px-2 py-0.5"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen)
                    }}
                    size="sm"
                    variant="outline"
                >
                    {isOpen ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            Hide condition
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            View condition
                        </>
                    )}
                </Button>
                <Button
                    className="bg-white rounded-[4px] h-8 p-1 w-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(value);
                    }}
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            {isOpen && (
                <>
                    <div className="items-center flex gap-2">
                        {category &&
                            <span
                                aria-label="category"
                                className="bg-neutral-100 rounded-[4px] text-neutral-600 text-xs px-1 py-0.5"
                            >
                                {category}
                            </span>
                        }

                        {description &&
                            <span
                                aria-hidden="true"
                                aria-label="description"
                                className="text-neutral-600 text-xs"
                            >
                                {description}
                            </span>
                        }
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-sm flex gap-2 justify-between overflow-hidden relative">
                        <Code
                            className="flex-1 max-h-50"
                            lineCount={true}
                            type={type}
                            value={value} 
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export interface Props {
    conditions: ConditionProps[];
}

export interface PropsExtended extends Props {
    onItemClick?: (condition: ConditionProps) => void;
}

export function Conditions({ conditions, onItemClick, ...props }: PropsExtended) {
    return (
        <div aria-label="conditions-list" {...props}>
            {conditions.map((condition) => (
                <Condition 
                    key={condition.label} 
                    onClick={onItemClick ? () => onItemClick(condition) : undefined} 
                    {...condition} 
                />
            ))}
        </div>
    );
}

