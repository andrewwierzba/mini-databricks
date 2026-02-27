"use client";

import { useMemo, useState } from "react";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export const TIME_ZONES = [
	{ label: "(UTC-08:00) Los Angeles", value: "America/Los_Angeles" },
	{ label: "(UTC-08:00) Pacific Time (US and Canada)", value: "US/Pacific" },
	{ label: "(UTC-06:00) Central Time (US and Canada)", value: "US/Central" },
	{ label: "(UTC-06:00) Chicago", value: "America/Chicago" },
	{ label: "(UTC-05:00) Eastern Time (US and Canada)", value: "US/Eastern" },
	{ label: "(UTC-05:00) New York", value: "America/New_York" },
	{ label: "(UTC+00:00) London", value: "Europe/London" },
	{ label: "(UTC+00:00) UTC", value: "UTC" },
	{ label: "(UTC+01:00) Amsterdam", value: "Europe/Amsterdam" },
	{ label: "(UTC+01:00) Copenhagen", value: "Europe/Copenhagen" },
	{ label: "(UTC+01:00) Paris", value: "Europe/Paris" },
	{ label: "(UTC+04:00) Dubai", value: "Asia/Dubai" },
	{ label: "(UTC+08:00) Singapore", value: "Asia/Singapore" },
	{ label: "(UTC+09:00) Seoul", value: "Asia/Seoul" },
	{ label: "(UTC+09:00) Tokyo", value: "Asia/Tokyo" },
];

const OPTION_CLASS =
	"flex font-normal gap-2 h-auto hover:bg-(--du-bois-blue-600)/8 items-center justify-start min-w-0 overflow-hidden px-2 py-1.5 rounded-sm text-left w-full";

interface TimeZoneOptionProps {
	label: string;
	onClick: () => void;
	selected: boolean;
}

function TimeZoneOption({ label, onClick, selected }: TimeZoneOptionProps) {
	return (
		<Button
			className={OPTION_CLASS}
			onClick={onClick}
			role="option"
			title={label}
			variant="ghost"
		>
			<span className="flex items-center justify-center shrink-0 size-4">
				{selected && <CheckIcon className="size-4" />}
			</span>
			<span className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>
		</Button>
	);
}

function getLocalTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

interface Props {
	onChange: (value: string | undefined) => void;
	value: string | undefined;
}

export function TimeZoneSelect({ onChange, value }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const localTimeZone = useMemo(() => getLocalTimeZone(), []);

	const label = TIME_ZONES.find((tz) => tz.value === value)?.label ?? "Time zone";

	const filteredTimeZones = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		if (!normalizedSearch) return TIME_ZONES;
		return TIME_ZONES.filter(
			(tz) =>
				tz.label.toLowerCase().includes(normalizedSearch) ||
				tz.value.toLowerCase().includes(normalizedSearch),
		);
	}, [search]);

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
						aria-label="Search time zones"
						className="h-8 focus-visible:border-(--du-bois-blue-600) focus-visible:ring-2 focus-visible:ring-(--du-bois-blue-600)/8"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search time zones"
						value={search}
					/>
				</div>
				<div className="flex flex-1 flex-col overflow-y-auto p-1" role="listbox">
					<TimeZoneOption
						label={`Local time (${localTimeZone})`}
						onClick={() => {
							onChange(undefined);
							setOpen(false);
						}}
						selected={value === undefined}
					/>
					<Separator className="my-1" />
					<div className="px-2 py-1 text-xs font-medium text-neutral-500">
						Time zones
					</div>
					{filteredTimeZones.length === 0 ? (
						<div className="px-2 py-4 text-center text-sm text-neutral-400">
							No time zones found
						</div>
					) : (
						filteredTimeZones.map((tz) => (
							<TimeZoneOption
								key={tz.value}
								label={tz.label}
								onClick={() => {
									onChange(tz.value);
									setOpen(false);
								}}
								selected={value === tz.value}
							/>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
