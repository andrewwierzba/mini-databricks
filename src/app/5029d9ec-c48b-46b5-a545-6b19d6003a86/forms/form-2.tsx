"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Box } from "@/components/mini-patterns/box";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { TimezoneSelect } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/components/timezone-select";

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "data-change" | "schedule";
type DataChangeMode = "file-arrival" | "model-update" | "table-update";

interface TriggerState {
	cronExpression?: string;
	dataChangeMode?: DataChangeMode;
	interval?: number;
	minuteOffset?: number;
	modelName?: string;
	monthDays?: number[];
	status: boolean;
	storageLocation?: string;
	tableNames?: string[];
	time?: string;
	timeUnit?: string;
	timezone?: string;
	type: string;
	weekDays?: Days[];
}

const DEFAULT_TRIGGER: TriggerState = {
	interval: 1,
	status: true,
	time: "09:00:00",
	timeUnit: "day",
	type: "schedule",
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

export type FieldOrientation = "horizontal" | "vertical";

export interface Props {
	orientation?: FieldOrientation;
}

export default function Form({ orientation }: Props) {
	const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(false);
	const [trigger, setTrigger] = useState<TriggerState>(DEFAULT_TRIGGER);

	return (
		<FieldSet>
			<FieldGroup className="gap-4">
				{/* Status */}
				<Field
					className={`items-center ${orientation === "horizontal" ? "gap-4" : "gap-2"}`}
					id="status"
					orientation="horizontal"
				>
					<FieldLabel className="min-w-[208px]" htmlFor="status">Status</FieldLabel>
					<div className="items-center flex gap-2">
						<span className="text-neutral-500 text-sm">{trigger.status ? "Active" : "Paused"}</span>
						<Switch
							checked={trigger.status}
							className="data-[state=checked]:bg-(--du-bois-blue-600)"
							onCheckedChange={(checked) => setTrigger((prev) => ({ ...prev, status: checked }))}
							value={trigger.status ? "active" : "paused"}
						/>
					</div>
				</Field>

				{/* Type */}
				<Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
					<FieldLabel className="min-w-[208px]" htmlFor="trigger-type">Type</FieldLabel>
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

				{/* Type: Schedule */}
				{trigger.type === "schedule" && (
					<div className="relative w-full">
						<FieldLabel className="absolute left-0 mt-[6px] min-w-[208px]" htmlFor="schedule-type">Schedule type</FieldLabel>
						<Tabs className="gap-4 w-full" defaultValue="interval">
							<TabsList className="ml-[calc(208px+16px)] w-auto">
								<TabsTrigger value="interval">Interval</TabsTrigger>
								<TabsTrigger value="cron">Cron</TabsTrigger>
							</TabsList>

							{/* Interval tab */}
							<TabsContent value="interval">
								<FieldSet>
									<FieldGroup className="gap-4">
										<Field className="items-start gap-4" orientation={orientation}>
											<FieldLabel className="mt-2 min-w-[208px]" htmlFor="run-every">Run every</FieldLabel>
											<div className="flex gap-2 w-full">
												{(() => {
													const unit = trigger.timeUnit;
													const max = unit === "minute" ? 59 : unit === "hour" ? 23 : unit === "day" ? 31 : 99;
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
															if (value === "week" && !prev.weekDays?.length) {
																return { ...next, time: prev.time ?? "09:00:00", weekDays: ["Mon" as Days] };
															}
															if (value === "month" && !prev.monthDays?.length) {
																return { ...next, time: prev.time ?? "09:00:00", monthDays: [1] };
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
														const days = trigger.monthDays ?? [];
														const first = days[0];
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
															const ord = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
															return (
																<SelectItem key={d} value={String(d)}>
																	The {d}{ord}
																</SelectItem>
															);
														})}
														<SelectItem value="last">The last day of the month</SelectItem>
													</SelectContent>
												</Select>
											</Field>
										)}

										{/* Hour: minute offset + timezone */}
										{trigger.timeUnit === "hour" && (
											<div className="items-center flex gap-2 pl-[224px]">
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
													<TimezoneSelect
														onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
														value={trigger.timezone}
													/>
												</div>
											</div>
										)}

										{/* Day/Week/Month: time + timezone */}
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
													<TimezoneSelect
														onChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
														value={trigger.timezone}
													/>
												</div>
											</div>
										)}
									</FieldGroup>
								</FieldSet>
							</TabsContent>

							{/* Cron tab */}
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
												<TimezoneSelect
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

				{/* Type: Data change */}
				{trigger.type === "data-change" && (
					<>
						<Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
							<FieldLabel className="min-w-[208px]" htmlFor="data-change-mode">Source</FieldLabel>
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

						{/* Data change: File arrival */}
						{trigger.dataChangeMode === "file-arrival" && (
							<Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
								<FieldLabel className="min-w-[208px]" htmlFor="storage-location">Storage location</FieldLabel>
								<Input
									id="storage-location"
									onChange={(e) => setTrigger((prev) => ({ ...prev, storageLocation: e.target.value }))}
									placeholder="e.g. /Volumes/mycatalog/myschema/myvolume/path/"
									value={trigger.storageLocation ?? ""}
								/>
							</Field>
						)}

						{/* Data change: Table update */}
						{trigger.dataChangeMode === "table-update" && (
						<Field className={`items-start ${orientation === "horizontal" ? "gap-4" : "gap-2"}`} orientation={orientation}>
							<FieldLabel className="mt-2 min-w-[208px]">Tables</FieldLabel>
								<div className="flex flex-col gap-2 w-full">
									{(trigger.tableNames ?? [""]).map((name, index, arr) => (
										<div className="flex gap-1" key={index}>
											<Input
												onChange={(e) => setTrigger((prev) => {
													const names = [...(prev.tableNames ?? [""])];
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
														tableNames: (prev.tableNames ?? [""]).filter((_, i) => i !== index),
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
											tableNames: [...(prev.tableNames ?? [""]), ""],
										}))}
										variant="outline"
									>
										<PlusIcon className="size-4 text-neutral-600" />
										<span>Add table</span>
									</Button>
								</div>
							</Field>
						)}

						{/* Data change: Model update */}
						{trigger.dataChangeMode === "model-update" && (
							<Field className={orientation === "horizontal" ? "gap-4" : "gap-2"} orientation={orientation}>
								<FieldLabel className="min-w-[208px]" htmlFor="model-name">Model name</FieldLabel>
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
						<Box className="items-center bg-neutral-100 border border-neutral-200 flex h-auto justify-center p-6 w-full">
							<span className="text-muted-foreground text-sm">Advanced configuration options will appear here.</span>
						</Box>
					)}
				</div>
			</FieldGroup>
		</FieldSet>
	);
}
