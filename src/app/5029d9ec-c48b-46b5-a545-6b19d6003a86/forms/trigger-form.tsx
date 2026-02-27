"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, EyeIcon, InfoIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Condition, Props as TriggerConditionProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/condition";
import { ConditionProps as ConditionPreviewProps } from "@/app/81ae035b-057f-45d5-8d8b-e82583bc2a65/components/conditions";
import { TimeZoneSelect } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/components/time-zone-select";

// Types

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type DataChangeMode = "file-arrival" | "model-update" | "table-update";
type TriggerType = "continuous" | "data-change" | "schedule";

interface BaseTriggerProps {
	activation?: {
		days: Days[];
		endTime: string;
		startTime: string;
		timezone?: string;
	};
	conditions?: TriggerConditionProps[];
	id?: string;
	status?: boolean;
}

interface ScheduleTriggerProps extends BaseTriggerProps {
	cronExpression?: string;
	interval?: number;
	minuteOffset?: number;
	monthDays?: number[];
	time?: string;
	timeUnit?: string;
	timezone?: string;
	type: "schedule";
	weekDays?: Days[];
}

interface ContinuousTriggerProps extends BaseTriggerProps {
	taskRetryMode?: "on-failure" | "never";
	type: "continuous";
}

interface DataChangeTriggerProps extends BaseTriggerProps {
	dataChangeMode?: DataChangeMode;
	minTimeBetweenTriggers?: number;
	modelName?: string;
	storageLocation?: string;
	tableNames?: string[];
	type: "data-change";
	waitAfterLastChange?: number;
}

export type TriggerProps = ContinuousTriggerProps | DataChangeTriggerProps | ScheduleTriggerProps;

// Type guards

function isSchedule(trigger: TriggerProps): trigger is ScheduleTriggerProps {
	return trigger.type === "schedule";
}

function isContinuous(trigger: TriggerProps): trigger is ContinuousTriggerProps {
	return trigger.type === "continuous";
}

function isDataChange(trigger: TriggerProps): trigger is DataChangeTriggerProps {
	return trigger.type === "data-change";
}

// Utilities

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

function getOrdinalSuffix(d: number): string {
	if (d % 10 === 1 && d !== 11) return "st";
	if (d % 10 === 2 && d !== 12) return "nd";
	if (d % 10 === 3 && d !== 13) return "rd";
	return "th";
}

// Constants

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

const DEFAULT_TRIGGER: TriggerProps = {
	conditions: [],
	interval: 1,
	status: true,
	time: "09:00:00",
	timeUnit: "day",
	type: "schedule",
};

// Props

export type FieldOrientation = "horizontal" | "vertical";

export interface Props {
	onChange?: (trigger: TriggerProps) => void;
	orientation?: FieldOrientation;
	trigger?: TriggerProps;
}

// Component

export default function TriggerForm({ onChange, orientation = "horizontal", trigger: triggerProp }: Props) {
	const [internalTrigger, setInternalTrigger] = useState<TriggerProps>(DEFAULT_TRIGGER);
	const trigger = triggerProp ?? internalTrigger;

	const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(false);

	const activationWindowMode = !trigger.activation
		? "on"
		: trigger.activation.days.length === 5 && WEEKDAY_VALUES.every((d) => trigger.activation!.days.includes(d))
			? "weekdays"
			: "custom";

	const setTrigger = (updater: TriggerProps | ((prev: TriggerProps) => TriggerProps)) => {
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

	return (
		<FieldSet className="[&_[data-slot=button]]:rounded-sm [&_[data-slot=input]]:border-(--du-bois-color-border) [&_[data-slot=input]]:rounded-sm [&_[data-slot=input]:focus-visible]:border-(--du-bois-blue-600) [&_[data-slot=input]:focus-visible]:ring-2 [&_[data-slot=input]:focus-visible]:ring-(--du-bois-blue-600)/8 [&_[data-slot=select-trigger]]:rounded-sm [&_[data-slot=select-trigger]:focus]:border-(--du-bois-blue-600) [&_[data-slot=select-trigger]:focus]:ring-2 [&_[data-slot=select-trigger]:focus]:ring-(--du-bois-blue-600)/8 [&_[data-slot=select-trigger]:focus-visible]:ring-2 [&_[data-slot=select-trigger]:focus-visible]:ring-(--du-bois-blue-600)/8 [&_[role=tab]]:rounded-sm">
			<FieldGroup className="gap-4">
				{/* Status */}
				<Field className="items-start gap-4" orientation={orientation}>
					<FieldLabel className="min-w-[208px]" htmlFor="trigger-status">Status</FieldLabel>
					<Field className="items-start gap-1.5 w-auto" orientation="horizontal">
						<Switch
							checked={trigger.status}
							className="data-[state=checked]:bg-(--du-bois-blue-600)"
							onCheckedChange={(checked) => setTrigger((prev) => ({ ...prev, status: checked }))}
						/>
						<Label className="font-[400] mt-0.5 text-neutral-500" htmlFor="trigger-status">
							{trigger.status ? "Active" : "Paused"}
						</Label>
					</Field>
				</Field>

				{/* Type */}
				<Field className="items-start gap-4" orientation={orientation}>
					<FieldLabel className="mt-[6px] min-w-[208px]" htmlFor="trigger-type">Type</FieldLabel>
					<Select
						onValueChange={(value) => setTrigger((prev) => ({ ...prev, type: value as TriggerType }))}
						value={trigger.type}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a trigger type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="schedule">Scheduled</SelectItem>
							<SelectItem value="continuous">Continuous</SelectItem>
							<SelectItem value="data-change">Data change</SelectItem>
						</SelectContent>
					</Select>
				</Field>

				{/* Schedule */}
				{isSchedule(trigger) && (
					<div className="relative w-full">
						<FieldLabel className="absolute left-0 mt-[6px] min-w-[208px]" htmlFor="schedule-type">Schedule type</FieldLabel>
						<Tabs className="gap-4 w-full" defaultValue="interval">
							<TabsList className="ml-[calc(208px+16px)] w-auto">
								<TabsTrigger value="interval">Interval</TabsTrigger>
								<TabsTrigger value="cron">Cron</TabsTrigger>
							</TabsList>

							{/* Interval */}
							<TabsContent value="interval">
								<FieldSet>
									<FieldGroup className="gap-4">
										<Field className="items-start gap-4" orientation={orientation}>
											<FieldLabel className="mt-2 min-w-[208px]" htmlFor="run-every">Run every</FieldLabel>
											<div className="flex gap-2 w-full">
												{(() => {
													const max = trigger.timeUnit === "minute" ? 59 : trigger.timeUnit === "hour" ? 23 : trigger.timeUnit === "day" ? 31 : 99;
													return (
														<Input
															className="w-23"
															id="schedule-interval"
															max={max}
															min={1}
															onChange={(e) => {
																const n = parseInt(e.target.value, 10);
																if (!Number.isNaN(n)) {
																	setTrigger((prev) => ({ ...prev, interval: Math.min(Math.max(n, 1), max) }));
																}
															}}
															type="number"
															value={trigger.interval ?? 1}
														/>
													);
												})()}
												<Select
													onValueChange={(value) => {
														setTrigger((prev) => {
															const next = { ...prev, interval: 1, timeUnit: value };
															if (value === "week" && !(prev as ScheduleTriggerProps).weekDays?.length) {
																return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", weekDays: ["Mon" as Days] };
															}
															if (value === "month" && !(prev as ScheduleTriggerProps).monthDays?.length) {
																return { ...next, time: (prev as ScheduleTriggerProps).time ?? "09:00:00", monthDays: [1] };
															}
															return next;
														});
													}}
													value={trigger.timeUnit || "day"}
												>
													<SelectTrigger className="flex-1" id="run-every">
														<SelectValue placeholder="Select an interval" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="minute">Minute</SelectItem>
														<SelectItem value="hour">Hour</SelectItem>
														<SelectItem value="day">Day</SelectItem>
														<SelectItem value="week">Week</SelectItem>
														<SelectItem value="month">Month</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</Field>

										{/* Week days */}
										{trigger.timeUnit === "week" && (
											<Field className="items-start gap-4" orientation={orientation}>
												<FieldLabel className="!flex-none mt-2 w-[208px]" />
												<ToggleGroup
													className="flex-nowrap overflow-x-auto"
													onValueChange={(value: Days[]) => setTrigger((prev) => ({ ...prev, weekDays: value }))}
													spacing={1.5}
													type="multiple"
													value={trigger.weekDays ?? []}
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
										)}

										{/* Month days */}
										{trigger.timeUnit === "month" && (
											<Field className="items-start gap-4" orientation={orientation}>
												<FieldLabel className="mt-2 min-w-[208px]" />
												<Select
													onValueChange={(value) => setTrigger((prev) => ({ ...prev, monthDays: [value === "last" ? 0 : parseInt(value, 10)] }))}
													value={(() => {
														const first = (trigger.monthDays ?? [])[0];
														if (first === undefined) return "";
														return first === 0 ? "last" : String(first);
													})()}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select day" />
													</SelectTrigger>
													<SelectContent>
														{Array.from({ length: 31 }, (_, i) => {
															const d = i + 1;
															return (
																<SelectItem key={d} value={String(d)}>
																	The {d}{getOrdinalSuffix(d)}
																</SelectItem>
															);
														})}
														<SelectItem value="last">The last day of the month</SelectItem>
													</SelectContent>
												</Select>
											</Field>
										)}

										{/* Hourly: minute offset + time zone */}
										{trigger.timeUnit === "hour" && (
											<div className="flex items-center gap-2 pl-[224px]">
												<Field className="flex-1 items-start gap-4 min-w-0" orientation={orientation}>
													<Select
														onValueChange={(value) => setTrigger((prev) => ({ ...prev, minuteOffset: parseInt(value, 10) }))}
														value={String(trigger.minuteOffset ?? 0)}
													>
														<SelectTrigger className="min-w-0 truncate w-full">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{Array.from({ length: 60 }, (_, i) => (
																<SelectItem key={i} value={String(i)}>
																	{i} minute(s) past the hour
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</Field>
												<div className="flex-1 min-w-0">
													<TimeZoneSelect
														onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
														value={trigger.timezone}
													/>
												</div>
											</div>
										)}

										{/* Day/Week/Month: time + time zone */}
										{(trigger.timeUnit === "day" || trigger.timeUnit === "week" || trigger.timeUnit === "month") && (
											<div className="flex items-center gap-2">
												<Field className="items-start gap-4 w-auto" orientation={orientation}>
													<FieldLabel className="!flex-none mt-2 min-w-[208px]" />
													<Input
														className="appearance-none bg-background w-auto [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
														onChange={(e) => setTrigger((prev) => ({ ...prev, time: e.target.value || "09:00:00" }))}
														step="1"
														type="time"
														value={trigger.time ?? "09:00:00"}
													/>
												</Field>
												<div className="flex-1 min-w-0">
													<TimeZoneSelect
														onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
														value={trigger.timezone}
													/>
												</div>
											</div>
										)}
									</FieldGroup>
								</FieldSet>
							</TabsContent>

							{/* Cron */}
							<TabsContent value="cron">
								<FieldSet>
									<FieldGroup className="gap-4">
										<Field className="items-start gap-4" orientation={orientation}>
											<FieldLabel className="mt-2 min-w-[208px]" htmlFor="cron-syntax">Cron syntax</FieldLabel>
											<Input
												className="font-mono w-full"
												id="cron-syntax"
												onChange={(e) => setTrigger((prev) => ({ ...prev, cronExpression: e.target.value }))}
												placeholder="0 30 9 ? * 1-5"
												value={trigger.cronExpression ?? ""}
											/>
										</Field>
										<Field className="items-start gap-4" orientation={orientation}>
											<FieldLabel className="!flex-none mt-2 min-w-[208px]" />
											<div className="flex flex-1 justify-start min-w-0">
												<TimeZoneSelect
													onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
													value={trigger.timezone}
												/>
											</div>
										</Field>
									</FieldGroup>
								</FieldSet>
							</TabsContent>
						</Tabs>
					</div>
				)}

				{/* Data change */}
				{isDataChange(trigger) && (
					<>
						<Field className="items-start gap-4" orientation={orientation}>
							<FieldLabel className="mt-[6px] min-w-[208px]" htmlFor="data-change-mode">Source</FieldLabel>
							<Select
								onValueChange={(value) => setTrigger((prev) => ({ ...prev, dataChangeMode: value as DataChangeMode }))}
								value={trigger.dataChangeMode}
							>
								<SelectTrigger className="w-full" id="data-change-mode">
									<SelectValue placeholder="Select a source" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="file-arrival">File arrival</SelectItem>
									<SelectItem value="table-update">Table update</SelectItem>
									<SelectItem value="model-update">Model update</SelectItem>
								</SelectContent>
							</Select>
						</Field>

						{/* File arrival */}
						{trigger.dataChangeMode === "file-arrival" && (
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="mt-2 min-w-[208px]" htmlFor="storage-location">Storage location</FieldLabel>
								<Input
									id="storage-location"
									onChange={(e) => setTrigger((prev) => ({ ...prev, storageLocation: e.target.value }))}
									placeholder="e.g. /Volumes/mycatalog/myschema/myvolume/path/"
									value={trigger.storageLocation ?? ""}
								/>
							</Field>
						)}

						{/* Table update */}
						{trigger.dataChangeMode === "table-update" && (
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="mt-2 min-w-[208px]">Tables</FieldLabel>
								<div className="flex flex-col gap-2 w-full">
									{(trigger.tableNames ?? [""]).map((name, index, arr) => (
										<div className="flex gap-1" key={index}>
											<Input
												onChange={(e) => setTrigger((prev) => {
													const names = [...((prev as DataChangeTriggerProps).tableNames ?? [""])];
													names[index] = e.target.value;
													return { ...prev, tableNames: names };
												})}
												placeholder="e.g. mycatalog.myschema.mytable"
												value={name}
											/>
											{arr.length > 1 && (
												<Button
													onClick={() => setTrigger((prev) => ({
														...prev,
														tableNames: ((prev as DataChangeTriggerProps).tableNames ?? [""]).filter((_, i) => i !== index),
													}))}
													size="icon"
													variant="ghost"
												>
													<TrashIcon />
												</Button>
											)}
										</div>
									))}
									<Button
										className="gap-1 self-start"
										onClick={() => setTrigger((prev) => ({
											...prev,
											tableNames: [...((prev as DataChangeTriggerProps).tableNames ?? [""]), ""],
										}))}
										variant="outline"
									>
										<PlusIcon className="size-4 text-neutral-600" />
										<span>Add table</span>
									</Button>
								</div>
							</Field>
						)}

						{/* Model update */}
						{trigger.dataChangeMode === "model-update" && (
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="mt-2 min-w-[208px]" htmlFor="model-name">Model name</FieldLabel>
								<Input
									id="model-name"
									onChange={(e) => setTrigger((prev) => ({ ...prev, modelName: e.target.value }))}
									placeholder="e.g. mycatalog.myschema.mymodel"
									value={trigger.modelName ?? ""}
								/>
							</Field>
						)}
					</>
				)}

				<Separator />

				{/* Advanced configuration */}
				<div className="flex flex-col gap-2">
					<div className="items-center flex gap-2">
						<span className="font-medium text-sm">Advanced configuration</span>
						<Button
							onClick={() => setShowAdvancedConfiguration(!showAdvancedConfiguration)}
							size="icon-sm"
							variant="ghost"
						>
							{showAdvancedConfiguration ? <ChevronUpIcon /> : <ChevronDownIcon />}
						</Button>
					</div>
					{showAdvancedConfiguration && (
						<FieldGroup className="gap-4">
							{/* Continuous: Task retry mode */}
							{isContinuous(trigger) && (
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
												<Field orientation={orientation}>
													<RadioGroupItem id="retry-on-failure" value="on-failure" />
													<FieldContent>
														<FieldLabel htmlFor="retry-on-failure">On failure</FieldLabel>
														<FieldDescription className="text-xs">
															When on failure is selected, failing tasks will retry as long as other tasks are still running in their first attempt. If all tasks are stuck retrying, a new job run will be created.
														</FieldDescription>
													</FieldContent>
												</Field>
												<Field orientation={orientation}>
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

							{/* Data change: Timing controls */}
							{isDataChange(trigger) && (
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

							{/* All types: Activation window */}
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
									<SelectTrigger className="w-full" id="activation-window">
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
									<Field className="items-start gap-4" orientation={orientation}>
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
									<Field className="items-start gap-4" orientation={orientation}>
										<FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="time-start">Time range</FieldLabel>
										<div className="flex gap-2">
											<div className="items-center flex gap-2 w-full">
												<Input
													className="appearance-none bg-background w-auto [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
													defaultValue="09:30:00"
													id="time-start"
													step="1"
													type="time"
												/>
												<span>-</span>
												<Input
													className="appearance-none bg-background w-auto [&::-webkit-calendar-picker-indicator]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
													defaultValue="17:30:00"
													id="time-end"
													step="1"
													type="time"
												/>
											</div>
											<div>
												<TimeZoneSelect
													onChange={(value) => setTrigger((prev) => ({
														...prev,
														activation: prev.activation ? { ...prev.activation, timezone: value } : undefined,
													}))}
													value={trigger.activation?.timezone}
												/>
											</div>
										</div>
									</Field>
								</div>
							)}

							<Separator />

							{/* All types: Trigger conditions */}
							<Field className="items-start gap-4" orientation={orientation}>
								<FieldLabel className="!flex-none mt-2 w-[208px]" htmlFor="trigger-condition">
									Trigger condition
								</FieldLabel>
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
			</FieldGroup>
		</FieldSet>
	);
}
