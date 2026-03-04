"use client";

import { useMemo } from "react";

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
} from "@/components/ui/combobox";

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

function getLocalTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

interface Props {
	className?: string;
	onChange: (value: string | undefined) => void;
	value: string | undefined;
}

export function TimeZone({ className, onChange, value }: Props) {
	const localTimeZone = useMemo(() => getLocalTimeZone(), []);
	const localLabel = `Local time (${localTimeZone})`;

	return (
		<Combobox
			onValueChange={(selected) => {
				if (selected === localTimeZone) {
					onChange(undefined);
				} else if (selected) {
					onChange(selected);
				}
			}}
			value={value ?? localTimeZone}
		>
			<ComboboxInput
				className={className}
				placeholder="Search time zones"
				showClear={false}
			/>
			<ComboboxContent>
				<ComboboxList>
					<ComboboxGroup>
						<ComboboxLabel>Recommended</ComboboxLabel>
						<ComboboxItem value={localTimeZone}>
							{localLabel}
						</ComboboxItem>
					</ComboboxGroup>
					<ComboboxSeparator />
					<ComboboxGroup>
						<ComboboxLabel>Standard time zones</ComboboxLabel>
						{TIME_ZONES.map((tz) => (
							<ComboboxItem key={tz.value} value={tz.value}>
								{tz.label}
							</ComboboxItem>
						))}
					</ComboboxGroup>
					<ComboboxEmpty>No time zones found</ComboboxEmpty>
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
