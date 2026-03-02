"use client";

import { useState } from "react";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface FileArrivalProps {
    storageLocation: string;
}

interface Props extends FileArrivalProps {
    gap?: number;
    onChange?: (state: FileArrivalProps) => void;
    orientation?: "horizontal" | "vertical";
}

const FileArrival = ({ gap = 4, onChange, orientation = "horizontal", storageLocation }: Props) => {
    const [fileArrivalState, setFileArrivalProps] = useState<FileArrivalProps>({ storageLocation });

    const updateState = (next: FileArrivalProps) => {
        setFileArrivalProps(next);
        onChange?.(next);
    };

    return (
        <FieldSet>
            <FieldGroup className={`gap-${gap}`}>
                <span className="text-neutral-500 text-sm">
                    File arrival triggers monitor cloud storage paths for new files. These paths are either Unity Catalog volumes or external locations managed through Unity Catalog.
                </span>
                <Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
                    <FieldLabel className="min-w-[208px]" htmlFor="storage-location">Storage location</FieldLabel>
                    <Input
                        id="storage-location"
                        onChange={(e) => updateState({ ...fileArrivalState, storageLocation: e.target.value })}
                        placeholder="e.g. '/Volumes/mycatalog/myschema/myvolume/path_within_volume/' or 's3://bucket/path/'"
                        value={fileArrivalState.storageLocation ?? ""}
                    />
                </Field>
            </FieldGroup>
        </FieldSet>
    );
};

export default FileArrival;