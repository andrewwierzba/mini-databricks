"use client";

import { useState } from "react";

import { ChevronDownIcon, OverflowIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";
import { ApplicationSettings } from "@/components/mini-ui/application-settings";
import { Box } from "@/components/mini-patterns/box";
import { Graph } from "@/components/ui/patterns/graph";
import Panel from "@/components/mini-patterns/panels/schedule";

export default function Page() {
	const [showDialog, setShowDialog] = useState<boolean>(false);

	return (
		<>
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

							<Graph className="min-h-0 flex-1" />
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel className="p-4" defaultSize={25}>
						<Panel
							author="first.lastname@databricks.com"
							compute={[{ id: "compute-1", value: "Serverless" }]}
							description="This job processes raw customer activity logs from the previous 24 hours and generates aggregated metrics for dashboard reporting."
							id="e1d517c0-4356-476d-a0a5-71ffc7a49444"
							parameters={[{ id: "parameter-1", label: "env", value: "staging" }]}
						/>
					</ResizablePanel>
				</ResizablePanelGroup>
			</ApplicationShell>
			<ApplicationSettings
				controls={[]}
			/>
		</>
	);
}
