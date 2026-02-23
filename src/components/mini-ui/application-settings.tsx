"use client";

import { Folder, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SwitchControlProps {
	id: string;
	label: string;
	onChange: (value: boolean) => void;
	type: "switch";
	value: boolean;
}

interface SelectControlProps {
	id: string;
	label: string;
	onChange: (value: string) => void;
	options: { label: string; value: string }[];
	type: "select";
	value: string;
}

type ControlProps = SelectControlProps | SwitchControlProps;

interface Props {
	controls: ControlProps[];
}

export function ApplicationSettings({ controls }: Props) {
	return (
		<div aria-label="project-settings" className="items-center bg-neutral-100 border-t bottom-0 flex gap-2 justify-between left-0 px-4 fixed right-0 z-100">
			<span className="items-center flex gap-2" title="Application settings">
				<Folder className="text-neutral-500 size-3" />
				<span className="text-neutral-500 text-xs">Application settings</span>
			</span>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon-sm">
						<Settings className="text-neutral-500 size-3" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="bg-neutral-100 text-neutral-500 flex flex-col text-sm gap-4 min-w-75 p-2 w-auto" side="top">
					{controls.map((control) => (
						<div className="items-center flex justify-between gap-3" key={control.label}>
							<Label className="text-xs whitespace-nowrap" htmlFor={control.id}>
								{control.label}
							</Label>
							{control.type === "switch" && (
								<Switch
									checked={control.value}
									className="data-[state=checked]:bg-(--du-bois-blue-600)"
									id={control.id}
									onCheckedChange={control.onChange}
								/>
							)}
							{control.type === "select" && (
								<Select onValueChange={control.onChange} value={control.value}>
									<SelectTrigger className="bg-background text-xs w-auto" id={control.id}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{control.options.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					))}
				</PopoverContent>
			</Popover>
		</div>
	);
}
