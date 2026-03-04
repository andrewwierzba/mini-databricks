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

import Form, { type FieldOrientation, type TriggerState } from "./form";

export type { TriggerState };

const DEFAULT_TRIGGER: TriggerState = {
	conditions: [],
	interval: 1,
	status: true,
	time: "09:00:00",
	timeUnit: "day",
	timezone: "Europe/Amsterdam",
	type: undefined,
};

interface TriggerDialogProps {
	initialTrigger?: Partial<TriggerState>;
	onOpenChange?: (open: boolean) => void;
	onSubmit?: (trigger: TriggerState) => void;
	open?: boolean;
	orientation?: FieldOrientation;
}

export default function TriggerDialog({ initialTrigger, onOpenChange, onSubmit, open, orientation }: TriggerDialogProps) {
	const [depth, setDepth] = useState(0);
	const [trigger, setTrigger] = useState<TriggerState>(DEFAULT_TRIGGER);

	useEffect(() => {
		if (open) {
			setDepth(0);
			setTrigger(initialTrigger ? { ...DEFAULT_TRIGGER, ...initialTrigger } : DEFAULT_TRIGGER);
		}
	}, [open, initialTrigger]);

	return (
		<Dialog
			defaultDepth={depth}
			onOpenChange={onOpenChange}
			open={open}
			setDepth={setDepth}
		>
			<DialogContent className="dialog-wide border-(--du-bois-color-border) flex flex-col max-h-[90vh] w-full">
				<DialogHeader>
					{depth === 0 && (
						<div className="items-center flex gap-2 justify-between">
							<DialogTitle className="text-2xl">Schedules & Triggers</DialogTitle>
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

				<div className="flex-1 overflow-auto pl-1 pr-3">
					{depth === 0 && (
						<Form
							onChange={setTrigger}
							orientation={orientation}
							trigger={trigger}
						/>
					)}
					{depth === 1 && (
						<div className="flex flex-col gap-4">
						</div>
					)}
				</div>

				<DialogFooter className="flex-row justify-end">
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
								Save
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
