"use client";

import { useState } from "react";

import {
	CatalogIcon,
	ChecklistIcon,
	ClockIcon,
	CloudDatabaseIcon,
	CloudIcon,
	DashboardIcon,
	GridIcon,
	HistoryIcon,
	NotebookIcon,
	NotificationIcon,
	QueryEditorIcon,
	QueryIcon,
	SparkleRectangleIcon,
	WorkflowsIcon,
	WorkspacesIcon,
} from "@databricks/design-system";
import {
	Box,
	ExternalLink,
	FlaskConical,
	GitBranch,
	Play,
	Server,
	StoreIcon,
} from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";

import { RightPanel } from "./components/right-panel";

interface NavigationGroup {
	items: NavigationItem[];
	name?: string;
}

interface NavigationItem {
	href: string;
	icon: React.ReactNode;
	isActive?: boolean;
	name: string;
}

const navigationItems: NavigationGroup[] = [
	{
		items: [
			{
				href: "/workspace",
				icon: <NotebookIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Workspace",
			},
			{
				href: "/recents",
				icon: <ClockIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Recents",
			},
			{
				href: "/catalog",
				icon: <CatalogIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Catalog",
			},
			{
				href: "/lakeflow",
				icon: <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				isActive: true,
				name: "Lakeflow",
			},
			{
				href: "/compute",
				icon: <CloudIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Compute",
			},
			{
				href: "/marketplace",
				icon: <StoreIcon className="h-4 w-4" />,
				name: "Marketplace",
			},
		],
	},
	{
		items: [
			{
				href: "/sql-editor",
				icon: <QueryEditorIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "SQL Editor",
			},
			{
				href: "/queries",
				icon: <QueryIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Queries",
			},
			{
				href: "/dashboards",
				icon: <DashboardIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Dashboards",
			},
			{
				href: "/genie",
				icon: <SparkleRectangleIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Genie",
			},
			{
				href: "/alerts",
				icon: <NotificationIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Alerts",
			},
			{
				href: "/query-history",
				icon: <HistoryIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Query History",
			},
			{
				href: "/sql-warehouses",
				icon: <CloudDatabaseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "SQL Warehouses",
			},
		],
		name: "SQL",
	},
	{
		items: [
			{
				href: "/runs",
				icon: <ChecklistIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Runs",
			},
			{
				href: "/data-ingestion",
				icon: <WorkspacesIcon className="rotate-90" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Data Ingestion",
			},
			{
				href: "/pipelines",
				icon: <GitBranch className="h-4 w-4" />,
				name: "Pipelines",
			},
		],
		name: "Data Engineering",
	},
	{
		items: [
			{
				href: "/playground",
				icon: <GridIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Playground",
			},
			{
				href: "/experiments",
				icon: <FlaskConical className="h-4 w-4" />,
				name: "Experiments",
			},
			{
				href: "/features",
				icon: <CatalogIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
				name: "Features",
			},
			{
				href: "/models",
				icon: <Box className="h-4 w-4" />,
				name: "Models",
			},
			{
				href: "/serving",
				icon: <Server className="h-4 w-4" />,
				name: "Serving",
			},
		],
		name: "Machine Learning",
	},
];

export default function JobRunDetailsPage() {
	const [showAssistant, setShowAssistant] = useState(false);

	return (
		<ApplicationShell
			navigationItems={navigationItems}
			onToggleAssistant={setShowAssistant}
			showAssistant={showAssistant}
		>
			<div className="flex flex-col h-full">
				{/* Page Header */}
				<div className="border-b border-gray-200 flex flex-col gap-4 px-6 py-4">
					{/* Breadcrumb */}
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink className="text-blue-600 hover:underline" href="#">
									Jobs & pipelines
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink className="text-blue-600 hover:underline" href="#">
									analytics.hourly_orders
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>63481d34-4170-44c9-9def-eae3d60db014</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					{/* Title Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-8 items-center justify-center text-gray-500 w-8">
								<Play className="h-5 w-5" />
							</div>
							<h1 className="font-semibold text-xl">Run analytics.hourly_orders</h1>
						</div>
						<div className="flex gap-2">
							<Button className="h-9" size="sm" variant="outline">
								Edit task
								<ExternalLink className="h-4 ml-1 w-4" />
							</Button>
							<Button
								className="bg-gray-100 h-9 text-gray-400"
								disabled
								size="sm"
								variant="secondary"
							>
								Repair run
							</Button>
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex flex-1 overflow-hidden">
					{/* Main Content (Grey Area) */}
					<div className="bg-gray-100 flex-1" />

					{/* Right Panel */}
					<RightPanel />
				</div>
			</div>
		</ApplicationShell>
	);
}
