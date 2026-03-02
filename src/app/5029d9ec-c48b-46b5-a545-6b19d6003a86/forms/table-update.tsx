"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { PlusIcon, TrashIcon } from "lucide-react";

export interface TableUpdateProps {
    names: string[];
}

interface Props extends TableUpdateProps {
    gap?: number;
    onChange?: (state: TableUpdateProps) => void;
    orientation?: "horizontal" | "vertical";
}

const TableUpdate = ({ gap = 4, names = [], onChange, orientation = "horizontal" }: Props) => {
    const [tableUpdateState, setTableUpdateProps] = useState<TableUpdateProps>({ names });

    const updateState = (next: TableUpdateProps) => {
        setTableUpdateProps(next);
        onChange?.(next);
    };

    return (
        <FieldSet>
            <FieldGroup className={`gap-${gap}`}>
                <Field className={`items-start ${orientation === "horizontal" ? "gap-4" : "gap-2"}`} orientation={orientation}>
                    <FieldLabel className="mt-2 min-w-[208px]">Tables</FieldLabel>
                    <div className="flex flex-col gap-2 w-full">
                        {(tableUpdateState.names ?? [""]).map((name, index, arr) => (
                            <div className="flex gap-1" key={index}>
                                <Input
                                    onChange={(e) => {
                                        const updated = [...(tableUpdateState.names ?? [""])];
                                        updated[index] = e.target.value;
                                        updateState({ ...tableUpdateState, names: updated });
                                    }}
                                    placeholder="e.g. mycatalog.myschema.mytable"
                                    value={name}
                                />
                                {arr.length > 1 && (
                                    <Button
                                        onClick={() => updateState({
                                            ...tableUpdateState,
                                            names: (tableUpdateState.names ?? [""]).filter((_, i) => i !== index),
                                        })}
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <TrashIcon />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            className="self-start gap-1"
                            onClick={() => updateState({
                                ...tableUpdateState,
                                names: [...(tableUpdateState.names ?? [""]), ""],
                            })}
                            variant="outline"
                        >
                            <PlusIcon className="size-4 text-neutral-600" />
                            <span>Add table</span>
                        </Button>
                    </div>
                </Field>
            </FieldGroup>
        </FieldSet>
    );
};

export default TableUpdate;