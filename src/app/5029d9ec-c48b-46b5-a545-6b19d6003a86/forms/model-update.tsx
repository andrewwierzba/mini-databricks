"use client";

import { useState } from "react";

import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelUpdateProps {
    name: string;
}

interface SchemaProps {
    name: string;
}

type ModelEvent = "alias-set" | "model-created" | "version-ready";

export interface ModelUpdateScopeProps {
    aliases?: string;
    event?: ModelEvent;
    model?: ModelUpdateProps;
    schema?: SchemaProps;
    type: "model" | "metastore" | "schema";
}

interface Props extends ModelUpdateScopeProps {
    gap?: number;
    onChange?: (state: ModelUpdateScopeProps) => void;
    orientation?: "horizontal" | "vertical";
}

const ModelUpdate = ({ gap = 4, model = { name: "" }, onChange, orientation = "horizontal", schema = { name: "" }, type = "model" }: Props) => {
    const [modelUpdateState, setModelUpdateState] = useState<ModelUpdateScopeProps>({ event: "version-ready", model: { name: model.name }, schema: { name: schema.name }, type });

    const updateState = (next: ModelUpdateScopeProps) => {
        setModelUpdateState(next);
        onChange?.(next);
    };

    return (
        <FieldSet>
            <FieldGroup className={`gap-${gap}`}>
                <Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
                    <FieldLabel className="min-w-[208px]" htmlFor="model-scope">Scope</FieldLabel>
                    <Select
                        onValueChange={(value) => updateState({ ...modelUpdateState, type: value as "model" | "metastore" | "schema" })}
                        value={modelUpdateState.type}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a model scope" />
                        </SelectTrigger>
                        <SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
                            <SelectItem description="Captures events under a model" value="model">Model</SelectItem>
                            <SelectItem description="Captures events under a schema" value="schema">Schema</SelectItem>
                            <SelectItem description="Captures events in the metastore" value="metastore">Metastore</SelectItem>
                        </SelectContent>
                    </Select>
                </Field>

                {/* Scope: Model */}
                {modelUpdateState.type === "model" && (
                    <Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
                        <FieldLabel className="min-w-[208px]" htmlFor="model-name">Model</FieldLabel>
                        <Input
                            id="model-name"
                            onChange={(e) => updateState({ ...modelUpdateState, model: { name: e.target.value } })}
                            placeholder="Enter model name (e.g. &quot;main.default.model&quot;)"
                            value={modelUpdateState.model?.name ?? ""}
                        />
                    </Field>
                )}

                {/* Scope: Schema */}
                {modelUpdateState.type === "schema" && (
                    <Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
                        <FieldLabel className="min-w-[208px]" htmlFor="schema-name">Schema</FieldLabel>
                        <Input
                            id="schema-name"
                            onChange={(e) => updateState({ ...modelUpdateState, schema: { name: e.target.value } })}
                            placeholder="Enter schema name (e.g. &quot;main.default&quot;)"
                            value={modelUpdateState.schema?.name ?? ""}
                        />
                    </Field>
                )}

                {/* Events */}
                <Field className={`items-start ${orientation === "horizontal" ? "gap-4" : "gap-2"}`} orientation={orientation}>
                    <FieldLabel className="min-w-[208px] mt-2" htmlFor="model-events">Events</FieldLabel>
                    <RadioGroup
                        className="w-full"
                        onValueChange={(value) => updateState({ ...modelUpdateState, event: value as ModelEvent })}
                        value={modelUpdateState.event}
                    >
                        <Field orientation="horizontal">
                            <RadioGroupItem id="version-ready" value="version-ready" />
                            <FieldContent>
                                <Label htmlFor="version-ready">Model version is ready</Label>
                                <FieldDescription className="text-xs">Triggers when a model version becomes ready.</FieldDescription>
                            </FieldContent>
                        </Field>
                        {(modelUpdateState.type === "schema" || modelUpdateState.type === "metastore") && (
                            <Field orientation="horizontal">
                                <RadioGroupItem id="model-created" value="model-created" />
                                <FieldContent>
                                    <Label htmlFor="model-created">Model is created</Label>
                                    <FieldDescription className="text-xs">Triggers when a model is created.</FieldDescription>
                                </FieldContent>
                            </Field>
                        )}
                        <Field orientation="horizontal">
                            <RadioGroupItem id="alias-set" value="alias-set" />
                            <FieldContent>
                                <Label htmlFor="alias-set">Model alias is set</Label>
                                <FieldDescription className="text-xs">Triggers when specified aliases are set on a model version.</FieldDescription>
                            </FieldContent>
                        </Field>
                    </RadioGroup>
                </Field>

                {/* Aliases */}
                {modelUpdateState.event === "alias-set" && (
                    <Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
                        <FieldLabel className="min-w-[208px]" htmlFor="model-aliases">Aliases</FieldLabel>
                        <Input
                            id="model-aliases"
                            onChange={(e) => updateState({ ...modelUpdateState, aliases: e.target.value })}
                            placeholder="Enter up to 10 aliases to be monitored"
                            value={modelUpdateState.aliases ?? ""}
                        />
                    </Field>
                )}
            </FieldGroup>
        </FieldSet>
    );
};

export default ModelUpdate;