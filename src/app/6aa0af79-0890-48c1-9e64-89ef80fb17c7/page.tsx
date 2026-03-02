"use client";

import { useState } from "react";

import { ChevronDownIcon, OverflowIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { Box } from "@/components/mini-patterns/box";
import { Graph } from "@/components/ui/patterns/graph";

import { TriggerProps } from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/forms/trigger-form";
import Settings from "@/app/5029d9ec-c48b-46b5-a545-6b19d6003a86/patterns/settings";

import { ApplicationSettings } from "@/components/mini-ui/application-settings";

import TriggerDialog, { TriggerState } from "@/app/6aa0af79-0890-48c1-9e64-89ef80fb17c7/trigger-dialog";
import { FieldOrientation } from "@/app/6aa0af79-0890-48c1-9e64-89ef80fb17c7/form";

function toSettingsTrigger(state: TriggerState): TriggerProps | undefined {
	if (!state.type) return undefined;

	switch (state.type) {
		case "schedule":
			return {
				conditions: [],
				cronExpression: state.cronExpression,
				interval: state.interval,
				minuteOffset: state.minuteOffset,
				monthDays: state.monthDays,
				status: state.status,
				time: state.time,
				timeUnit: state.timeUnit,
				timezone: state.timezone,
				type: "schedule",
				weekDays: state.weekDays,
			};
		case "continuous":
			return {
				conditions: [],
				status: state.status,
				type: "continuous",
			};
		case "file-arrival":
			return {
				conditions: [],
				dataChangeMode: "file-arrival",
				status: state.status,
				storageLocation: state.storageLocation,
				type: "data-change",
			};
		case "table-update":
			return {
				conditions: [],
				dataChangeMode: "table-update",
				status: state.status,
				tableNames: state.tableNames,
				type: "data-change",
			};
		case "model-update":
			return {
				conditions: [],
				dataChangeMode: "model-update",
				status: state.status,
				type: "data-change",
			};
	}
}

export default function Page() {
	const [orientation, setOrientation] = useState<FieldOrientation>("vertical");
	const [showDialog, setShowDialog] = useState<boolean>(true);
	const [triggerState, setTriggerState] = useState<TriggerState | undefined>(undefined);

	const settingsTrigger = triggerState ? toSettingsTrigger(triggerState) : undefined;

	return (
		<>
			<div className="h-full pb-8">
				<ApplicationShell>
					<ResizablePanelGroup direction="horizontal">
						<ResizablePanel className="p-4" defaultSize={75}>
							<div className="flex flex-col gap-4 h-full">
								<div className="flex gap-2">
									<Box className="bg-gray-50 border-gray-200 rounded-sm border-dashed flex h-full items-center justify-center w-full">
										<span className="text-center">Navigation / toolbar</span>
									</Box>
									<div className="flex gap-2 justify-end">
										<Button size="icon-sm" variant="ghost">
											<OverflowIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
										</Button>
										<ButtonGroup>
											<Button className="bg-(--du-bois-blue-600) border-b-0 border-l-0 rounded-sm border-r-white border-r-1 border-t-0 text-white hover:bg-(--du-bois-blue-700) hover:text-white" size="sm" variant="outline">Run now</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button className="bg-(--du-bois-blue-600) rounded-sm border-none text-white hover:bg-(--du-bois-blue-700) hover:text-white" size="icon-sm" variant="outline">
														<ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="border-gray-200">
													<DropdownMenuItem>Run now with different settings</DropdownMenuItem>
													<DropdownMenuItem>Run backfill</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</ButtonGroup>
									</div>
								</div>

								<Graph className="border rounded-sm min-h-0 flex-1" />
							</div>
						</ResizablePanel>
						<ResizableHandle />
						<ResizablePanel className="p-4" defaultSize={25}>
							<Settings
								author="andrew.wierzba@databricks.com"
								compute="Serverless"
								description="This job processes raw customer activity logs from the previous 24 hours and generates aggregated metrics for dashboard reporting."
								id="63481d34-4170-44c9-9def-eae3d60db014"
								parameters={[{ id: "env", label: "Environment", value: "staging" }]}
								trigger={settingsTrigger}
								onAddTrigger={() => setShowDialog(true)}
								onDeleteTrigger={() => setTriggerState(undefined)}
								onEditTrigger={() => setShowDialog(true)}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>

					<TriggerDialog
						initialTrigger={triggerState}
						onOpenChange={setShowDialog}
						onSubmit={(trigger) => {
							setTriggerState(trigger);
							setShowDialog(false);
						}}
						open={showDialog}
						orientation={orientation}
					/>
				</ApplicationShell>
			</div>

			<ApplicationSettings
				controls={[
					{
						id: "orientation",
						label: "Orientation",
						onChange: (value) => setOrientation(value as FieldOrientation),
						options: [
							{ label: "Horizontal", value: "horizontal" },
							{ label: "Vertical", value: "vertical" },
						],
						type: "select",
						value: orientation,
					},
				]}
			/>
		</>
	)
}
