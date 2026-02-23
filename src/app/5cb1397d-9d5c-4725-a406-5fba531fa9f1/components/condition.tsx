"use client";

import { useState } from "react";

import { Play, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Spinner } from "@/components/ui/spinner";

import { Code } from "../../../components/mini-ui/code";

export interface Props {
    id: string;
    label: string;
    type: "sql" | "python";
    value: string;
}

export interface ExtendedProps extends Props {
    isRunning?: boolean;
    onChange?: (value: string) => void;
    onDelete: () => void;
    onRun: (condition: Props) => void;
    onTypeChange?: (type: "sql" | "python") => void;
}

export function Condition({
    id,
    label,
    type,
    value,
    isRunning = false,
    onChange,
    onDelete,
    onRun,
    onTypeChange
}: ExtendedProps) {
    const [localType, setLocalType] = useState(type);

    const handleTypeChange = (type: "sql" | "python") => {
        setLocalType(type);
        onTypeChange?.(type);
    };

    return (
        <div
            aria-label="condition"
            className="flex flex-col gap-2"
            id={id}
        >         
            <div className="bg-white border border-neutral-200 rounded-sm shadow-xs flex flex-col overflow-hidden">
                {/* Header */}
                <div className="items-center flex gap-2 justify-between p-1.5">
                    <span className="text-sm font-semibold pl-1">{label}</span>
                    
                    {/* <ButtonGroup>
                        <Button 
                            className="data-[state=active]:bg-black/8 border-neutral-200 data-[state=active]:border-neutral-600 rounded-[4px] h-6 px-2 py-0.5" 
                            data-state={localType === "sql" ? "active" : "inactive"}
                            onClick={() => handleTypeChange("sql")} 
                            size="sm" 
                            variant="outline"
                        >
                            SQL
                        </Button>
                        <Button 
                            className="data-[state=active]:bg-black/8 border-neutral-200 data-[state=active]:border-neutral-600 rounded-[4px] h-6 px-2 py-0.5" 
                            data-state={localType === "python" ? "active" : "inactive"}
                            onClick={() => handleTypeChange("python")} 
                            size="sm" 
                            variant="outline"
                        >
                            Python
                        </Button>
                    </ButtonGroup> */}

                    <Button 
                        className="rounded-[4px] h-6 p-1 w-6" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                        size="icon" 
                        variant="ghost"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <Code
                    className="border-neutral-200 border-t-1 flex-1 max-h-50"
                    lineCount={true}
                    onChange={onChange}
                    type={localType}
                    value={value} 
                />

                {/* Footer */}
                <div className="items-center border-neutral-200 border-t-1 flex gap-2 justify-between p-1.5">
                    <div className="text-xs text-gray-600">
                        Click <span className="bg-gray-200 text-gray-600 rounded-[4px] px-1 py-0.5">Run test</span> to evaluate condition.
                    </div>
                    <Button
                        className="border-neutral-200 rounded-[4px] h-6 px-2 py-0.5"
                        disabled={isRunning}
                        onClick={() => onRun?.({ id, label, type, value })}
                        size="sm"
                        variant="outline"
                    >
                        {isRunning ?
                            <>
                                <Spinner />Running...
                            </> :
                            <>
                                <Play className="fill-gray-600 stroke-gray-600" style={{ height: 12, width: 12 }} />Run test
                            </>
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
}

