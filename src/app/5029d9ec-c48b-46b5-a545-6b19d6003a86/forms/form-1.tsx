"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "lucide-react";

import { Box } from "@/components/mini-patterns/box";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TIME_ZONES } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/components/time-zone-select";

type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
type TriggerType = "continuous" | "file-arrival" | "model-update" | "schedule" | "table-update";

interface TriggerState {
	cronExpression?: string;
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
	type?: TriggerType;
	weekDays?: Days[];
}

const DEFAULT_TRIGGER: TriggerState = {
	interval: 1,
	status: true,
	time: "09:00:00",
	timeUnit: "day",
	timezone: "Europe/Amsterdam",
	type: undefined,
};

type FieldOrientation = "horizontal" | "vertical";

const INTERVAL_OPTIONS: Record<string, number[]> = {
	day: Array.from({ length: 31 }, (_, i) => i + 1),
	hour: Array.from({ length: 23 }, (_, i) => i + 1),
	minute: Array.from({ length: 59 }, (_, i) => i + 1),
	month: Array.from({ length: 12 }, (_, i) => i + 1),
	week: Array.from({ length: 8 }, (_, i) => i + 1),
};

export interface Props {
	orientation?: FieldOrientation;
}

export default function Form({ orientation }: Props) {
	const [showAdvancedConfiguration, setShowAdvancedConfiguration] = useState(false);
	const [showCronSyntax, setShowCronSyntax] = useState(false);
	const [trigger, setTrigger] = useState<TriggerState>(DEFAULT_TRIGGER);

	return (
		<FieldSet className="[&_[data-slot=button]]:rounded-sm [&_[data-slot=input]]:rounded-sm [&_[data-slot=input]:focus-visible]:ring-2 [&_[data-slot=input]:focus-visible]:ring-(--du-bois-blue-600) [&_[data-slot=select-trigger]]:rounded-sm [&_[data-slot=select-trigger]:focus]:ring-2 [&_[data-slot=select-trigger]:focus]:ring-(--du-bois-blue-600) [&_[data-slot=select-trigger]:focus-visible]:ring-2 [&_[data-slot=select-trigger]:focus-visible]:ring-(--du-bois-blue-600)">
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
						<SelectTrigger className="w-full" id="trigger-type">
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

				{/* Type: Schedule */}
				{trigger.type === "schedule" && (
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel htmlFor="trigger-schedule-type">Schedule type</FieldLabel>
						<Tabs className="gap-6" defaultValue="simple">
							<TabsList className="bg-transparent border-none h-auto p-0 rounded-sm">
								<TabsTrigger className="border border-border border-r-0 data-[state=active]:bg-(--du-bois-blue-600)/16 data-[state=active]:border-(--du-bois-blue-800) data-[state=active]:border-r data-[state=active]:rounded-e-none data-[state=active]:text-(--du-bois-blue-800) h-8 px-3 py-1.5 rounded-e-none rounded-s-sm" value="simple">Simple</TabsTrigger>
								<TabsTrigger className="border border-border border-l-0 data-[state=active]:bg-(--du-bois-blue-600)/16 data-[state=active]:border-(--du-bois-blue-800) data-[state=active]:border-l data-[state=active]:rounded-s-none data-[state=active]:text-(--du-bois-blue-800) h-8 px-3 py-1.5 rounded-e-sm rounded-s-none" value="advanced">Advanced</TabsTrigger>
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
														<SelectTrigger className="flex-1 min-w-0 truncate w-full" id="run-every-adv">
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
													<SelectTrigger className="flex-1 min-w-0 truncate w-full">
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
															<SelectTrigger className="flex-1 min-w-0 truncate w-full">
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
															<SelectTrigger className="flex-1 min-w-0 truncate w-full">
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
										<Select
											onValueChange={(value) => setTrigger((prev) => ({ ...prev, timezone: value }))}
											value={trigger.timezone}
										>
											<SelectTrigger className="flex-1 min-w-0 truncate w-full">
												<SelectValue placeholder="Select a time zone" />
											</SelectTrigger>
											<SelectContent className="[&_[data-slot=select-item]:focus]:bg-(--du-bois-blue-600)/8">
												{TIME_ZONES.map((tz) => (
													<SelectItem key={tz.value} value={tz.value}>
														{tz.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FieldGroup>

									{/* Cron syntax toggle */}
									<div className="items-center flex gap-2 mt-1">
										<Checkbox
											checked={showCronSyntax}
											className="data-[state=checked]:bg-(--du-bois-blue-600) data-[state=checked]:border-(--du-bois-blue-600)"
											id="show-cron-syntax"
											onCheckedChange={(checked) => setShowCronSyntax(checked === true)}
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
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel htmlFor="storage-location">Storage location</FieldLabel>
						<Input
							id="storage-location"
							onChange={(e) => setTrigger((prev) => ({ ...prev, storageLocation: e.target.value }))}
							placeholder="e.g. /Volumes/mycatalog/myschema/myvolume/path/"
							value={trigger.storageLocation ?? ""}
						/>
					</Field>
				)}

				{/* Type: Table update */}
				{trigger.type === "table-update" && (
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel>Tables</FieldLabel>
						<div className="flex flex-col gap-2">
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

				{/* Type: Model update */}
				{trigger.type === "model-update" && (
					<Field className="gap-2" orientation={orientation}>
						<FieldLabel htmlFor="model-name">Model name</FieldLabel>
						<Input
							id="model-name"
							onChange={(e) => setTrigger((prev) => ({ ...prev, modelName: e.target.value }))}
							placeholder="e.g. mycatalog.myschema.mymodel"
							value={trigger.modelName ?? ""}
						/>
					</Field>
				)}

				{/* Advanced configuration */}
				<>
                    <Separator />
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
                </>
			</FieldGroup>
		</FieldSet>
	);
}
