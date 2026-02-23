"use client";

import { useState } from "react";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export const TIME_ZONES = [
	{ label: "(UTC-05:00) Eastern Time (US and Canada)", value: "US/Eastern" },
	{ label: "(UTC-05:00) New York", value: "America/New_York" },
	{ label: "(UTC-06:00) Central Time (US and Canada)", value: "US/Central" },
	{ label: "(UTC-06:00) Chicago", value: "America/Chicago" },
	{ label: "(UTC-08:00) Los Angeles", value: "America/Los_Angeles" },
	{ label: "(UTC-08:00) Pacific Time (US and Canada)", value: "US/Pacific" },
	{ label: "(UTC+00:00) London", value: "Europe/London" },
	{ label: "(UTC+00:00) UTC", value: "UTC" },
	{ label: "(UTC+01:00) Amsterdam", value: "Europe/Amsterdam" },
	{ label: "(UTC+01:00) Copenhagen", value: "Europe/Copenhagen" },
	{ label: "(UTC+01:00) Paris", value: "Europe/Paris" },
	{ label: "(UTC+04:00) Dubai", value: "Asia/Dubai" },
	{ label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
	{ label: "(UTC+09:00) Seoul", value: "Asia/Seoul" },
	{ label: "(UTC+09:00) Tokyo", value: "Asia/Tokyo" }
];

interface Props {
	onChange: (value: string | undefined) => void;
	value: string | undefined;
}

export function TimezoneSelect({ onChange, value }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const label = TIME_ZONES.find((tz) => tz.value === value)?.label ?? "Time zone";

	return (
		<Popover
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) setSearch("");
			}}
			open={open}
		>
			<PopoverTrigger asChild>
				<Button
					className="text-(--du-bois-blue-600) max-w-full min-w-0 px-3 hover:bg-(--du-bois-blue-700)/10 hover:text-(--du-bois-blue-800)"
					title={label}
					variant="ghost"
				>
					<span className="overflow-hidden text-ellipsis whitespace-nowrap">
						{label}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="flex flex-col max-h-80 overflow-hidden p-0 w-72">
				<div className="border-b p-2">
					<Input
						className="h-8"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search time zones"
						value={search}
					/>
				</div>
				<div className="flex flex-1 flex-col overflow-y-auto p-1">
					<Button
						className="items-center flex font-normal gap-2 h-auto justify-start min-w-0 overflow-hidden px-2 py-1.5 text-left w-full"
						variant="ghost"
						onClick={() => {
							onChange(undefined);
							setOpen(false);
						}}
					>
						<span className="flex size-4 shrink-0 items-center justify-center">
							{value === undefined && <CheckIcon className="size-4" />}
						</span>
						<span className="overflow-hidden text-ellipsis whitespace-nowrap">Use local time</span>
					</Button>
					<Separator className="my-1" />
					<div className="px-2 py-1 text-xs font-medium text-neutral-500">
						Time zones
					</div>
					{TIME_ZONES.filter(
						(tz) =>
							!search.trim() ||
							tz.label.toLowerCase().includes(search.toLowerCase().trim()) ||
							tz.value.toLowerCase().includes(search.toLowerCase().trim())
					).map((tz) => (
						<Button
							className="flex h-auto min-w-0 items-center justify-start gap-2 overflow-hidden px-2 py-1.5 text-left font-normal w-full"
							key={tz.value}
							title={tz.label}
							variant="ghost"
							onClick={() => {
								onChange(tz.value);
								setOpen(false);
							}}
						>
							<span className="flex size-4 shrink-0 items-center justify-center">
								{value === tz.value && <CheckIcon className="size-4" />}
							</span>
							<span className="overflow-hidden text-ellipsis whitespace-nowrap">{tz.label}</span>
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
}
