"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, EyeIcon, InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Condition, Props as TriggerConditionProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/condition";
import { ConditionProps as ConditionPreviewProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/conditions";
import { TimeZone } from "@/components/mini-patterns/time-zone";
import FileArrival from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/file-arrival";
import ModelUpdate from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/model-update";
import TableUpdate from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/table-update";

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "file-arrival" | "model-update" | "schedule" | "table-update";

export interface TriggerState {
	activation?: {
		days: Days[];
		endTime: string;
		startTime: string;
		timezone?: string;
	};
	conditions?: TriggerConditionProps[];
	cronExpression?: string;
	interval?: number;
	minTimeBetweenTriggers?: number;
	minuteOffset?: number;
	modelName?: string;
	monthDays?: number[];
	status: boolean;
	storageLocation?: string;
	tableNames?: string[];
	taskRetryMode?: "on-failure" | "never";
	time?: string;
	timeUnit?: string;
	timezone?: string;
	type?: TriggerType;
	waitAfterLastChange?: number;
	weekDays?: Days[];
}

function getLocalTimeZone(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const DEFAULT_TRIGGER: TriggerState = {
	conditions: [],
	interval: 1,
	status: true,
	time: "09:00:00",
	timeUnit: "day",
	type: undefined,
};

export type FieldOrientation = "horizontal" | "vertical";

const INTERVAL_OPTIONS: Record<string, number[]> = {
	day: Array.from({ length: 31 }, (_, i) => i + 1),
	hour: Array.from({ length: 23 }, (_, i) => i + 1),
	minute: Array.from({ length: 59 }, (_, i) => i + 1),
	month: Array.from({ length: 12 }, (_, i) => i + 1),
	week: Array.from({ length: 8 }, (_, i) => i + 1),
};

const WEEK_DAYS: { label: string; value: Days }[] = [
	{ label: "Sunday", value: "Sun" },
	{ label: "Monday", value: "Mon" },
	{ label: "Tuesday", value: "Tue" },
	{ label: "Wednesday", value: "Wed" },
	{ label: "Thursday", value: "Thu" },
	{ label: "Friday", value: "Fri" },
	{ label: "Saturday", value: "Sat" },
];

const WEEKDAY_VALUES: Days[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const EXAMPLE_SQL_TRIGGERS: ConditionPreviewProps[] = [
	{ category: "Schedule", description: "Ensures the trigger fires only if today is Monday.", label: "Run only on Mondays", type: "sql", value: "SELECT date_format(current_date, 'E') = 'Mon'" },
	{ category: "Schedule", description: "Limits execution to between 8 AM and 6 PM local time.", label: "Business hours only", type: "sql", value: "SELECT hour(current_timestamp()) BETWEEN 8 AND 18" },
	{ category: "Table", description: "Verifies that new records arrived within the past hour.", label: "Fresh data check", type: "sql", value: "SELECT max(event_ts) > now() - INTERVAL 1 HOUR FROM catalog.db.events" },
	{ category: "Table", description: "Only runs if the target table contains more than 100,000 rows.", label: "Row count threshold", type: "sql", value: "SELECT count(*) > 100000 FROM catalog.sales.transactions" },
	{ category: "Table", description: "Triggers when the average data quality score exceeds 95%.", label: "High data quality", type: "sql", value: "SELECT avg(score) > 0.95 FROM catalog.dq.results WHERE table='bronze.customers'" },
	{ category: "Job", description: "Waits for both upstream jobs to finish successfully before triggering.", label: "Job A and Job B completed", type: "sql", value: "SELECT count(*) = 2 FROM system.job_runs WHERE job_name IN ('JobA','JobB') AND status='Succeeded' AND start_time > current_date" },
	{ category: "Table", description: "Triggers only if null and duplicate rates stay below acceptable thresholds.", label: "No data anomalies", type: "sql", value: "SELECT null_rate < 0.01 AND dup_rate < 0.001 FROM catalog.metrics.table_health WHERE table='customers'" },
];

function secondsToTimeString(seconds: number | undefined): string {
	if (!seconds) return "00h 00m";
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
}

function parseTimeString(timeString: string): number {
	const match = timeString.match(/(\d+)h\s*(\d+)m/);
	if (!match) return 0;
	return parseInt(match[1], 10) * 3600 + parseInt(match[2], 10) * 60;
}

function isDataChangeType(type?: TriggerType): boolean {
	return type === "file-arrival" || type === "table-update" || type === "model-update";
}

function generateCronExpression(trigger: TriggerState): string {
	const timeUnit = trigger.timeUnit ?? "day";
	const interval = trigger.interval ?? 1;
	const time = trigger.time ?? "09:00:00";
	const [hours, minutes] = time.split(":").map(Number);

	switch (timeUnit) {
		case "minute":
			return interval === 1 ? "0 * * ? * *" : `0 */${interval} * ? * *`;
		case "hour": {
			const offset = trigger.minuteOffset ?? 0;
			return interval === 1 ? `0 ${offset} * ? * *` : `0 ${offset} */${interval} ? * *`;
		}
		case "day":
			return interval === 1 ? `0 ${minutes} ${hours} * * ?` : `0 ${minutes} ${hours} */${interval} * ?`;
		case "week": {
			const days = trigger.weekDays ?? ["Mon"];
			return `0 ${minutes} ${hours} ? * ${days.join(",")}`;
		}
		case "month": {
			const day = (trigger.monthDays ?? [1])[0] ?? 1;
			return `0 ${minutes} ${hours} ${day === 0 ? "L" : day} * ?`;
		}
		default:
			return `0 ${minutes} ${hours} * * ?`;
	}
}

function formatTime12h(time24: string, timezone?: string): string {
	const [hStr, mStr] = time24.split(":");
	let h = parseInt(hStr, 10);
	const period = h >= 12 ? "PM" : "AM";
	if (h === 0) h = 12;
	else if (h > 12) h -= 12;
	const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
	let offset = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" })
		.formatToParts(new Date())
		.find((p) => p.type === "timeZoneName")?.value ?? "";
	if (offset === "GMT") offset = "UTC";
	else offset = offset.replace("GMT", "UTC");
	return `${h}:${mStr} ${period} ${offset}`;
}

export interface Props {
	onChange?: (trigger: TriggerState) => void;
	orientation?: FieldOrientation;
	trigger?: TriggerState;
}

export default function Form({ onChange, orientation = "vertical", trigger: triggerProp }: Props) {
	const [internalTrigger, setInternalTrigger] = useState<TriggerState>(() => ({
		...DEFAULT_TRIGGER,
		timezone: getLocalTimeZone(),
	}));
	const trigger = triggerProp ?? internalTrigger;

	const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(false);
	const [showCronSyntax, setShowCronSyntax] = useState(false);

	const setTrigger = (updater: TriggerState | ((prev: TriggerState) => TriggerState)) => {
		const next = typeof updater === "function" ? updater(trigger) : updater;
		if (triggerProp !== undefined) {
			onChange?.(next);
		} else {
			setInternalTrigger(next);
			onChange?.(next);
		}
	};

	const triggerConditions = trigger.conditions ?? [];
	const setTriggerConditions = (conditions: TriggerConditionProps[]) => {
		const next = { ...trigger, conditions };
		if (triggerProp !== undefined) {
			onChange?.(next);
		} else {
			setInternalTrigger(next);
			onChange?.(next);
		}
	};

	const activationWindowMode = !trigger.activation
		? "on"
		: trigger.activation.days.length === 5 && WEEKDAY_VALUES.every((d) => trigger.activation!.days.includes(d))
			? "weekdays"
			: "custom";

	return (
		<FieldSet className="[&_[data-slot=button]]:rounded-sm [&_[data-slot=input]]:border-(--du-bois-color-border) [&_[data-slot=input]]:rounded-sm [&_[data-slot=input]]:text-sm! [&_[data-slot=input]:focus-visible]:border-(--du-bois-blue-600) [&_[data-slot=input]:focus-visible]:ring-2 [&_[data-slot=input]:focus-visible]:ring-(--du-bois-blue-600)/8 [&_[data-slot=input-group]]:border-(--du-bois-color-border)! [&_[data-slot=input-group]]:rounded-sm! [&_[data-slot=input-group]_input]:text-sm! [&_[data-slot=input-group]:has(:focus-visible)]:border-(--du-bois-blue-600)! [&_[data-slot=input-group]:has(:focus-visible)]:ring-2! [&_[data-slot=input-group]:has(:focus-visible)]:ring-(--du-bois-blue-600)/8! [&_[data-slot=select-trigger]]:rounded-sm [&_[data-slot=select-trigger]:focus]:border-(--du-bois-blue-600) [&_[data-slot=select-trigger]:focus]:ring-2 [&_[data-slot=select-trigger]:focus]:ring-(--du-bois-blue-600)/8 [&_[data-slot=select-trigger]:focus-visible]:ring-2 [&_[data-slot=select-trigger]:focus-visible]:ring-(--du-bois-blue-600)/8 [&_[role=tab]]:rounded-sm">
			<FieldGroup className="gap-6">
				{/* Status */}
				{trigger.type !== undefined && (
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel htmlFor="status">Trigger status</FieldLabel>
						<RadioGroup
							onValueChange={(value) => setTrigger((prev) => ({ ...prev, status: value === "active" }))}
							value={trigger.status ? "active" : "paused"}
						>
							<div className="items-center flex gap-2">
								<RadioGroupItem id="r1" value="active" />
								<Label htmlFor="r1">Active</Label>
							</div>
							<div className="items-center flex gap-2">
								<RadioGroupItem id="r2" value="paused" />
								<Label htmlFor="r2">Paused</Label>
							</div>
						</RadioGroup>
					</Field>
				)}

				{/* Type */}
				<Field className="gap-2" orientation={orientation}>
					<FieldLabel htmlFor="trigger-type">Trigger type</FieldLabel>
					<Select
						onValueChange={(value) => setTrigger((prev) => ({ ...prev, type: value as TriggerType }))}
						value={trigger.type}
					>
						<SelectTrigger className="max-w-82 min-w-0 w-full" id="trigger-type">
							<SelectValue placeholder="None (manual)" />
						</SelectTrigger>
						<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
							<SelectItem value="schedule">Scheduled</SelectItem>
							<SelectItem value="file-arrival">File arrival</SelectItem>
							<SelectItem value="table-update">Table update</SelectItem>
							<SelectItem value="continuous">Continuous</SelectItem>
							<SelectItem value="model-update">Model update</SelectItem>
						</SelectContent>
					</Select>
				</Field>

				{/* Type: Continuous */}
				{trigger.type === "continuous" && (
					<span className="text-sm">
						A continuous job ensures that there is always one active run. A new run is created as soon as the previous one finished (due to failure or success) or when there are none.
					</span>
				)}

				{/* Type: Schedule */}
				{trigger.type === "schedule" && (
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel htmlFor="trigger-schedule-type">Schedule type</FieldLabel>
						<Tabs className="gap-6" defaultValue="simple">
							<TabsList className="bg-transparent border-none h-auto p-0 rounded-sm">
								<TabsTrigger className="border border-border border-r-0 data-[state=active]:bg-(--du-bois-blue-600)/16 data-[state=active]:border-(--du-bois-blue-800) data-[state=active]:border-r data-[state=active]:text-(--du-bois-blue-800) h-8 px-3 py-1.5 !rounded-bl-sm !rounded-br-none !rounded-tl-sm !rounded-tr-none" value="simple">Simple</TabsTrigger>
								<TabsTrigger className="border border-border border-l-0 data-[state=active]:bg-(--du-bois-blue-600)/16 data-[state=active]:border-(--du-bois-blue-800) data-[state=active]:border-l data-[state=active]:text-(--du-bois-blue-800) h-8 px-3 py-1.5 !rounded-bl-none !rounded-br-sm !rounded-tl-none !rounded-tr-sm" value="advanced">Advanced</TabsTrigger>
							</TabsList>

							{/* Simple tab */}
							<TabsContent value="simple">
								<FieldSet className="gap-2">
									<FieldLabel>Periodic</FieldLabel>
									<Field orientation="horizontal">
										<FieldLabel htmlFor="run-every-simple">Every</FieldLabel>
										<FieldGroup className="flex flex-row gap-2">
											<Select
												defaultValue="1"
												onValueChange={(value) => setTrigger((prev) => ({ ...prev, interval: parseInt(value, 10) }))}
											>
												<SelectTrigger className="w-full" id="run-every-simple">
													<SelectValue placeholder="Select an interval" />
												</SelectTrigger>
												<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
													{INTERVAL_OPTIONS[trigger.timeUnit ?? "day"].map((n) => (
														<SelectItem key={n} value={String(n)}>{n}</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Select
												defaultValue={trigger.timeUnit}
												onValueChange={(value) => setTrigger((prev) => ({ ...prev, timeUnit: value }))}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a unit" />
												</SelectTrigger>
												<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
													<SelectItem value="hour">Hour</SelectItem>
													<SelectItem value="day">Day</SelectItem>
													<SelectItem value="week">Week</SelectItem>
												</SelectContent>
											</Select>
										</FieldGroup>
									</Field>
								</FieldSet>
							</TabsContent>

							{/* Advanced tab */}
							<TabsContent value="advanced">
								<FieldSet className="gap-2">
									<FieldLabel>Schedule</FieldLabel>
									<FieldGroup className="flex flex-row gap-2">
										{!showCronSyntax && (
											<>
												<FieldLabel htmlFor="run-every-adv">Every</FieldLabel>

												{/* Interval (minute/hour only) */}
												{(trigger.timeUnit === "minute" || trigger.timeUnit === "hour") && (
													<Select
														defaultValue="1"
														onValueChange={(value) => setTrigger((prev) => ({ ...prev, interval: parseInt(value, 10) }))}
													>
														<SelectTrigger className="min-w-0 truncate" id="run-every-adv">
															<SelectValue placeholder="Select an interval" />
														</SelectTrigger>
														<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
															{INTERVAL_OPTIONS[trigger.timeUnit].map((n) => (
																<SelectItem key={n} value={String(n)}>{n}</SelectItem>
															))}
														</SelectContent>
													</Select>
												)}

												{/* Unit */}
												<Select
													defaultValue={trigger.timeUnit}
													onValueChange={(value) => setTrigger((prev) => ({ ...prev, timeUnit: value }))}
												>
													<SelectTrigger className="min-w-0 truncate">
														<SelectValue placeholder="Select a unit" />
													</SelectTrigger>
													<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
														<SelectItem value="minute">Minute</SelectItem>
														<SelectItem value="hour">Hour</SelectItem>
														<SelectItem value="day">Day</SelectItem>
														<SelectItem value="week">Week</SelectItem>
														<SelectItem value="month">Month</SelectItem>
													</SelectContent>
												</Select>

												{/* Hour: minute offset */}
												{trigger.timeUnit === "hour" && (
													<>
														<FieldLabel className="shrink-0">at</FieldLabel>
														<Select
															defaultValue="0"
															onValueChange={(value) => setTrigger((prev) => ({ ...prev, minuteOffset: parseInt(value, 10) }))}
														>
															<SelectTrigger className="min-w-0 truncate">
																<SelectValue placeholder="Minute offset" />
															</SelectTrigger>
															<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
																{Array.from({ length: 60 }, (_, i) => (
																	<SelectItem key={i} value={String(i)}>
																		{i} minute(s) past the hour
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</>
												)}

												{/* Week: day of week */}
												{trigger.timeUnit === "week" && (
													<>
														<FieldLabel className="shrink-0">on</FieldLabel>
														<Select
															onValueChange={(value) => setTrigger((prev) => ({ ...prev, weekDays: [value as Days] }))}
															value={trigger.weekDays?.[0] ?? "Mon"}
														>
															<SelectTrigger className="min-w-0 truncate">
																<SelectValue placeholder="Day" />
															</SelectTrigger>
															<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
																<SelectItem value="Mon">Monday</SelectItem>
																<SelectItem value="Tue">Tuesday</SelectItem>
																<SelectItem value="Wed">Wednesday</SelectItem>
																<SelectItem value="Thu">Thursday</SelectItem>
																<SelectItem value="Fri">Friday</SelectItem>
																<SelectItem value="Sat">Saturday</SelectItem>
																<SelectItem value="Sun">Sunday</SelectItem>
															</SelectContent>
														</Select>
													</>
												)}

												{/* Month: day of month */}
												{trigger.timeUnit === "month" && (
													<>
														<FieldLabel className="shrink-0">on day</FieldLabel>
														<Select
															onValueChange={(value) => setTrigger((prev) => ({ ...prev, monthDays: [parseInt(value, 10)] }))}
															value={String(trigger.monthDays?.[0] ?? 1)}
														>
															<SelectTrigger className="flex-1 min-w-0 truncate w-full">
																<SelectValue placeholder="Day" />
															</SelectTrigger>
															<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
																{Array.from({ length: 31 }, (_, i) => {
																	const d = i + 1;
																	const ord = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
																	return (
																		<SelectItem key={d} value={String(d)}>
																			{d}{ord}
																		</SelectItem>
																	);
																})}
															</SelectContent>
														</Select>
													</>
												)}

												{/* Day/Week/Month: time */}
												{(trigger.timeUnit === "day" || trigger.timeUnit === "week" || trigger.timeUnit === "month") && (
													<>
														<FieldLabel className="shrink-0">at</FieldLabel>
														<div className="items-center flex gap-1">
															<Select
																onValueChange={(value) => setTrigger((prev) => {
																	const [, m] = (prev.time ?? "09:00:00").split(":");
																	return { ...prev, time: `${value.padStart(2, "0")}:${m}:00` };
																})}
																value={String(parseInt((trigger.time ?? "09:00:00").split(":")[0], 10))}
															>
																<SelectTrigger className="flex-1 min-w-0 truncate w-full">
																	<SelectValue placeholder="Hour" />
																</SelectTrigger>
																<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
																	{Array.from({ length: 24 }, (_, i) => (
																		<SelectItem key={i} value={String(i)}>
																			{String(i).padStart(2, "0")}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<span className="shrink-0">:</span>
															<Select
																onValueChange={(value) => setTrigger((prev) => {
																	const [h] = (prev.time ?? "09:00:00").split(":");
																	return { ...prev, time: `${h}:${value.padStart(2, "0")}:00` };
																})}
																value={String(parseInt((trigger.time ?? "09:00:00").split(":")[1], 10))}
															>
																<SelectTrigger className="flex-1 min-w-0 truncate w-full">
																	<SelectValue placeholder="Min" />
																</SelectTrigger>
																<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
																	{Array.from({ length: 60 }, (_, i) => (
																		<SelectItem key={i} value={String(i)}>
																			{String(i).padStart(2, "0")}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</div>
													</>
												)}
											</>
										)}

										{/* Cron syntax input */}
										{showCronSyntax && (
											<Input
												className="flex-1 font-mono min-w-0"
												id="cron-expression"
												onChange={(e) => setTrigger((prev) => ({ ...prev, cronExpression: e.target.value }))}
												placeholder="0 30 9 ? * 1-5"
												value={trigger.cronExpression ?? ""}
											/>
										)}

										{/* Time zone */}
										<TimeZone
											className="flex-1 min-w-0"
											onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
											showLocalLabel={false}
											value={trigger.timezone}
										/>
									</FieldGroup>

									{/* Cron syntax toggle */}
									<div className="items-center flex gap-2 mt-1">
										<Checkbox
											checked={showCronSyntax}
											className="data-[state=checked]:bg-(--du-bois-blue-600) data-[state=checked]:border-(--du-bois-blue-600)"
											id="show-cron-syntax"
											onCheckedChange={(checked) => {
											const show = checked === true;
											setShowCronSyntax(show);
											if (show) {
												setTrigger((prev) => ({
													...prev,
													cronExpression: generateCronExpression(prev),
												}));
											}
										}}
										/>
										<Label htmlFor="show-cron-syntax">Show cron syntax</Label>
									</div>
								</FieldSet>
							</TabsContent>
						</Tabs>
					</Field>
				)}

				{/* Type: File arrival */}
				{trigger.type === "file-arrival" && (
					<FileArrival orientation={orientation} storageLocation={trigger.storageLocation ?? ""} />
				)}

				{/* Type: Table update */}
				{trigger.type === "table-update" && (
					<TableUpdate names={trigger.tableNames ?? [""]} orientation={orientation} />
				)}

				{/* Type: Model update */}
				{trigger.type === "model-update" && (
					<ModelUpdate orientation={orientation} type="model" />
				)}

				{/* Advanced configuration */}
				{trigger.type !== undefined && (
					<>
						<div className="flex flex-col gap-2">
							<div className="cursor-pointer items-center flex gap-2 group justify-between hover:text-(--du-bois-blue-700)" onClick={() => setShowAdvancedConfiguration(!showAdvancedConfiguration)}>
								<span className="font-medium text-sm">Advanced</span>
								<span className="rounded-sm mt-[1px]">
									{showAdvancedConfiguration ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
								</span>
							</div>
							{showAdvancedConfiguration && (
								<FieldGroup className="gap-4">
							{/* Continuous: Task retry mode */}
							{trigger.type === "continuous" && (
								<>
									<Field className="items-start gap-4" orientation={orientation}>
										<FieldLabel className="!flex-none w-[208px]" htmlFor="task-retry-mode">Task retry mode</FieldLabel>
										<div className="flex flex-col gap-2 w-full">
											<RadioGroup
												onValueChange={(value) => setTrigger((prev) => ({
													...prev,
													taskRetryMode: value as "on-failure" | "never",
												}))}
												value={trigger.taskRetryMode || "on-failure"}
											>
											<Field orientation="horizontal">
												<RadioGroupItem id="retry-on-failure" value="on-failure" />
												<FieldContent>
													<FieldLabel htmlFor="retry-on-failure">On failure</FieldLabel>
													<FieldDescription className="text-xs">
														When on failure is selected, failing tasks will retry as long as other tasks are still running in their first attempt. If all tasks are stuck retrying, a new job run will be created.
													</FieldDescription>
												</FieldContent>
											</Field>
											<Field orientation="horizontal">
												<RadioGroupItem id="retry-never" value="never" />
												<FieldContent>
													<FieldLabel htmlFor="retry-never">Never</FieldLabel>
													<FieldDescription className="text-xs">
														When never is selected, tasks that fail will not be retried. The next run will start when the current run completes.
													</FieldDescription>
												</FieldContent>
											</Field>
											</RadioGroup>
										</div>
									</Field>
									<Separator />
								</>
							)}

							{/* Data change types: Timing controls */}
							{isDataChangeType(trigger.type) && (
								<>
									<Field className="items-start gap-4" orientation={orientation}>
										<FieldLabel className="!flex-none gap-1.5 w-[208px]" htmlFor="min-time-between-triggers">
											Minimum time between triggers
											<Tooltip>
												<TooltipTrigger asChild>
													<InfoIcon className="shrink-0 size-4 text-neutral-400" />
												</TooltipTrigger>
												<TooltipContent>
													Minimum time to wait before triggering again
												</TooltipContent>
											</Tooltip>
										</FieldLabel>
										<Input
											className="w-32"
											id="min-time-between-triggers"
											onChange={(e) => {
												const seconds = parseTimeString(e.target.value);
												setTrigger((prev) => ({ ...prev, minTimeBetweenTriggers: seconds }));
											}}
											placeholder="00h 00m"
											value={secondsToTimeString(trigger.minTimeBetweenTriggers)}
										/>
									</Field>
									<Field className="items-start gap-4" orientation={orientation}>
										<FieldLabel className="!flex-none gap-1.5 w-[208px]" htmlFor="wait-after-last-change">
											Wait after last change
											<Tooltip>
												<TooltipTrigger asChild>
													<InfoIcon className="shrink-0 size-4 text-neutral-400" />
												</TooltipTrigger>
												<TooltipContent>
													Time to wait after detecting the last change
												</TooltipContent>
											</Tooltip>
										</FieldLabel>
										<Input
											className="w-32"
											id="wait-after-last-change"
											onChange={(e) => {
												const seconds = parseTimeString(e.target.value);
												setTrigger((prev) => ({ ...prev, waitAfterLastChange: seconds }));
											}}
											placeholder="00h 00m"
											value={secondsToTimeString(trigger.waitAfterLastChange)}
										/>
									</Field>
									<Separator />
								</>
							)}

							{/* Activation window */}
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="!flex-none mt-2 gap-1.5 w-[208px]" htmlFor="activation-window">
									Activation window
								</FieldLabel>
								<Select
									onValueChange={(value) => {
										if (value === "on") {
											setTrigger((prev) => ({ ...prev, activation: undefined }));
										} else if (value === "weekdays") {
											setTrigger((prev) => ({
												...prev,
												activation: {
													...prev.activation,
													days: [...WEEKDAY_VALUES],
													endTime: prev.activation?.endTime ?? "17:30:00",
													startTime: prev.activation?.startTime ?? "09:30:00",
												},
											}));
										} else {
											setTrigger((prev) => ({
												...prev,
												activation: {
													...prev.activation,
													days: [],
													endTime: prev.activation?.endTime ?? "17:30:00",
													startTime: prev.activation?.startTime ?? "09:30:00",
												},
											}));
										}
									}}
									value={activationWindowMode}
								>
									<SelectTrigger className="min-w-0 w-full" id="activation-window">
										<SelectValue placeholder="Select an activation window" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="on">Always active</SelectItem>
										<SelectItem value="weekdays">Weekdays</SelectItem>
										<SelectItem value="custom">Custom</SelectItem>
									</SelectContent>
								</Select>
							</Field>
							{activationWindowMode !== "on" && (
								<div className="flex flex-col gap-4">
									<Field className="items-start gap-4 min-w-0" orientation={orientation}>
										<FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="time-days">Days</FieldLabel>
										<ToggleGroup
											onValueChange={(value: Days[]) => setTrigger((prev) => ({
												...prev,
												activation: prev.activation ? { ...prev.activation, days: value } : undefined,
											}))}
											spacing={1.5}
											type="multiple"
											value={trigger.activation?.days || []}
										>
											{WEEK_DAYS.map((day) => (
												<Tooltip key={day.value}>
													<ToggleGroupItem
														asChild
														className="data-[state=on]:bg-(--du-bois-blue-700)/10 data-[state=on]:border-(--du-bois-blue-800) data-[state=on]:text-(--du-bois-blue-800) min-w-10"
														value={day.value}
														variant="outline"
													>
														<TooltipTrigger>{day.value[0]}</TooltipTrigger>
													</ToggleGroupItem>
													<TooltipContent>{day.label}</TooltipContent>
												</Tooltip>
											))}
										</ToggleGroup>
									</Field>
									<Field className="items-start gap-4 min-w-0" orientation={orientation}>
										<FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="time-start">Time range</FieldLabel>
										<div className="flex gap-2 min-w-0">
											{/* Start time */}
											<div className="items-center flex gap-1">
												<Select
													onValueChange={(value) => setTrigger((prev) => {
														const [, m] = (prev.activation?.startTime ?? "09:30:00").split(":");
														return {
															...prev,
															activation: prev.activation ? { ...prev.activation, startTime: `${value.padStart(2, "0")}:${m}:00` } : undefined,
														};
													})}
													value={String(parseInt((trigger.activation?.startTime ?? "09:30:00").split(":")[0], 10))}
												>
													<SelectTrigger className="min-w-0 w-full" id="time-start">
														<SelectValue placeholder="Hour" />
													</SelectTrigger>
													<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
														{Array.from({ length: 24 }, (_, i) => (
															<SelectItem key={i} value={String(i)}>
																{String(i).padStart(2, "0")}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<span className="shrink-0">:</span>
												<Select
													onValueChange={(value) => setTrigger((prev) => {
														const [h] = (prev.activation?.startTime ?? "09:30:00").split(":");
														return {
															...prev,
															activation: prev.activation ? { ...prev.activation, startTime: `${h}:${value.padStart(2, "0")}:00` } : undefined,
														};
													})}
													value={String(parseInt((trigger.activation?.startTime ?? "09:30:00").split(":")[1], 10))}
												>
													<SelectTrigger className="min-w-0 w-full">
														<SelectValue placeholder="Min" />
													</SelectTrigger>
													<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
														{Array.from({ length: 60 }, (_, i) => (
															<SelectItem key={i} value={String(i)}>
																{String(i).padStart(2, "0")}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<span className="mt-2 shrink-0">-</span>

											{/* End time */}
											<div className="items-center flex gap-1">
												<Select
													onValueChange={(value) => setTrigger((prev) => {
														const [, m] = (prev.activation?.endTime ?? "17:30:00").split(":");
														return {
															...prev,
															activation: prev.activation ? { ...prev.activation, endTime: `${value.padStart(2, "0")}:${m}:00` } : undefined,
														};
													})}
													value={String(parseInt((trigger.activation?.endTime ?? "17:30:00").split(":")[0], 10))}
												>
													<SelectTrigger className="min-w-0 w-full" id="time-end">
														<SelectValue placeholder="Hour" />
													</SelectTrigger>
													<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
														{Array.from({ length: 24 }, (_, i) => (
															<SelectItem key={i} value={String(i)}>
																{String(i).padStart(2, "0")}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<span className="shrink-0">:</span>
												<Select
													onValueChange={(value) => setTrigger((prev) => {
														const [h] = (prev.activation?.endTime ?? "17:30:00").split(":");
														return {
															...prev,
															activation: prev.activation ? { ...prev.activation, endTime: `${h}:${value.padStart(2, "0")}:00` } : undefined,
														};
													})}
													value={String(parseInt((trigger.activation?.endTime ?? "17:30:00").split(":")[1], 10))}
												>
													<SelectTrigger className="min-w-0 w-full">
														<SelectValue placeholder="Min" />
													</SelectTrigger>
													<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
														{Array.from({ length: 60 }, (_, i) => (
															<SelectItem key={i} value={String(i)}>
																{String(i).padStart(2, "0")}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<TimeZone
												className="flex-1 min-w-0"
												onChange={(value) => setTrigger((prev) => ({
													...prev,
													activation: prev.activation ? { ...prev.activation, timezone: value } : undefined,
												}))}
												showLocalLabel={false}
												value={trigger.activation?.timezone}
											/>
										</div>
									</Field>
								</div>
							)}

							<Separator />

							{/* Trigger conditions */}
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="trigger-condition">
									Trigger condition
								</FieldLabel>
								<div className="min-w-0 w-full">
									<Combobox
										onValueChange={(details: { value?: string[] } | null) => {
										const selectedValue = details?.value?.[0];
										if (selectedValue) {
											const template = EXAMPLE_SQL_TRIGGERS.find((t) => t.label === selectedValue);
											if (template) {
												setTriggerConditions([...triggerConditions, {
													id: crypto.randomUUID(),
													label: template.label,
													type: template.type,
													value: template.value,
												}]);
											}
										}
									}}
								>
									<ComboboxInput
										className="w-full"
										id="trigger-condition"
										placeholder="Select a trigger condition"
									/>
									<ComboboxContent className="p-1">
										<ComboboxList>
											{EXAMPLE_SQL_TRIGGERS.map((item) => (
												<ComboboxItem key={item.label} value={item.label}>
													<div className="items-center flex flex-1 justify-between w-full">
														<span>{item.label}</span>
														<div className="items-center flex gap-1">
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		className="rounded-sm size-6 hover:bg-black/5"
																		onClick={(e) => e.stopPropagation()}
																		size="icon-sm"
																		variant="ghost"
																	>
																		<EyeIcon className="size-4 text-(--du-bois-text-secondary)" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent className="max-w-md">
																	<pre className="overflow-x-auto text-xs whitespace-pre-wrap">
																		<code>{item.value}</code>
																	</pre>
																</TooltipContent>
															</Tooltip>
															<Button
																className="rounded-sm size-6 hover:bg-black/5"
																onClick={(e) => e.stopPropagation()}
																size="icon-sm"
																variant="ghost"
															>
																<ExternalLinkIcon className="size-4 text-(--du-bois-blue-600)" />
															</Button>
														</div>
													</div>
												</ComboboxItem>
											))}
										</ComboboxList>
									</ComboboxContent>
									</Combobox>
								</div>
							</Field>
							<div className="flex flex-col gap-4">
								{triggerConditions.map((condition, index) => (
									<Condition
										key={index}
										{...condition}
										onDelete={() => setTriggerConditions(triggerConditions.filter((_, i) => i !== index))}
										onRun={() => {}}
									/>
								))}
								</div>
							</FieldGroup>
						)}
						</div>
					</>
				)}
			</FieldGroup>
		</FieldSet>
	);
}
