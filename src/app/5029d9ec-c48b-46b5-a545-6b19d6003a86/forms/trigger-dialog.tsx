"use client";

import { useEffect, useState } from "react";

import { ArrowLeft, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/dialog";

import TriggerForm, { type Props as TriggerFormProps, type TriggerProps } from "./trigger-form";

export type { TriggerProps };

interface TriggerDialogProps {
    initialTrigger?: Partial<TriggerProps>;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    orientation?: TriggerFormProps["orientation"];
    resetTrigger?: number;
    onSubmit?: (trigger: TriggerProps) => void;
    variant?: TriggerFormProps["variant"];
}

const DEFAULT_TRIGGER: TriggerProps = {
    conditions: [],
    interval: 1,
    scheduleMode: "interval",
    status: true,
    time: "09:00:00",
    timeUnit: "day",
    type: "schedule"
};

export default function TriggerDialog({ onOpenChange, onSubmit, open, orientation, variant }: TriggerDialogProps) {
    const [depth, setDepth] = useState(0);
    const [trigger, setTrigger] = useState<TriggerProps>(DEFAULT_TRIGGER);

    useEffect(() => {
        if (open) {
            setDepth(0);
            setTrigger(DEFAULT_TRIGGER);
        }
    }, [open]);

    return (
        <Dialog
            defaultDepth={depth}
            onOpenChange={onOpenChange}
            open={open}
            setDepth={setDepth}
        >
            <DialogContent className="sm:max-w-[600px] border-(--du-bois-color-border) flex flex-col max-h-[90vh]">
                <DialogHeader>
                    {depth === 0 && (
                        <div className="items-center flex gap-2 justify-between">
                            <DialogTitle>New trigger</DialogTitle>
                            <DialogClose asChild>
                                <Button
                                    className="rounded-sm text-gray-600 h-8 p-2 w-8"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                    )}

                    {depth === 1 && (
                        <div className="items-center flex gap-2">
                            <Button
                                className="rounded-sm text-gray-600 h-8 p-2 w-8"
                                onClick={() => setDepth(0)}
                                size="icon"
                                variant="ghost"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <DialogTitle>Pick a condition</DialogTitle>
                        </div>
                    )}
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                    {depth === 0 && (
                        <TriggerForm
                            onChange={setTrigger}
                            orientation={orientation}
                            trigger={trigger}
                            variant={variant}
                        />
                    )}
                    {depth === 1 && (
                        <div className="flex flex-col gap-4">
                            {/* Placeholder for "Pick a condition" depth - kept for dialog structure */}
                        </div>
                    )}
                </div>
                
                <DialogFooter>
                    {depth === 0 && (
                        <>
                            <DialogClose asChild>
                                <Button className="rounded-sm" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                className="bg-(--du-bois-blue-600) rounded-sm px-3"
                                onClick={() => {
                                    onSubmit?.(trigger);
                                    onOpenChange?.(false);
                                }}
                            >
                                Create
                            </Button>
                        </>
                    )}

                    {depth === 1 && (
                        <>
                            <Button
                                className="rounded-sm px-3"
                                onClick={() => setDepth(0)}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
