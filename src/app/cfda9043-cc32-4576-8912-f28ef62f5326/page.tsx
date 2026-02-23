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
	AlertCircle,
	Box,
	CheckCircle2,
	ExternalLink,
	FlaskConical,
	GitBranch,
	Play,
	RefreshCw,
	Server,
	Sparkles,
	StoreIcon,
	XCircle,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ApplicationShell } from "@/components/ui/patterns/application-shell";

import { AutomatedDiagnosisSection } from "./components/automated-diagnosis";
import { DependencyGraphSection } from "./components/dependency-graph";
import { ErrorSummarySection } from "./components/error-summary";
import { HistoricalContextSection } from "./components/historical-context";
import { RemediationOptionsSection } from "./components/remediation-options";

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

export default function JobFailureAssistantPage() {
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
									daily_customer_aggregate_job
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Run 87432</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					{/* Title Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-red-100 flex h-10 items-center justify-center rounded-md text-red-600 w-10">
								<XCircle className="h-6 w-6" />
							</div>
							<div className="flex flex-col">
								<div className="flex gap-2 items-center">
									<h1 className="font-semibold text-xl">daily_customer_aggregate_job</h1>
									<Badge className="bg-red-100 text-red-600" variant="secondary">
										Failed
									</Badge>
								</div>
								<p className="text-gray-500 text-sm">
									Run ID: 87432 • Failed at 2:47 AM • Duration: 12m 34s
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button className="h-9" size="sm" variant="outline">
								<RefreshCw className="h-4 mr-1 w-4" />
								Re-run
							</Button>
							<Button className="h-9" size="sm" variant="outline">
								Repair run
							</Button>
							<Button className="h-9" size="sm" variant="outline">
								View logs
								<ExternalLink className="h-4 ml-1 w-4" />
							</Button>
						</div>
					</div>

					{/* AI Assistant Alert */}
					<Alert className="bg-blue-50 border-blue-200">
						<Sparkles className="h-4 text-blue-600 w-4" />
						<AlertDescription className="flex items-center justify-between">
							<span className="text-blue-900 text-sm">
								<strong>AI Assistant:</strong> I've analyzed this failure and identified the root cause with 90% confidence.
								Scroll down to see my diagnosis and suggested fixes.
							</span>
						</AlertDescription>
					</Alert>
				</div>

				{/* Main Content Area */}
				<div className="flex-1 overflow-auto">
					<div className="p-6">
						<Tabs className="w-full" defaultValue="ai-assistant">
							<TabsList className="mb-6">
								<TabsTrigger value="ai-assistant">
									<Sparkles className="h-4 mr-2 w-4" />
									AI Assistant
								</TabsTrigger>
								<TabsTrigger value="task-details">Task Details</TabsTrigger>
								<TabsTrigger value="cluster-logs">Cluster Logs</TabsTrigger>
								<TabsTrigger value="run-history">Run History</TabsTrigger>
							</TabsList>

							<TabsContent className="space-y-6" value="ai-assistant">
								{/* Error Summary Section */}
								<ErrorSummarySection />

								<Separator />

								{/* Automated Diagnosis Section */}
								<AutomatedDiagnosisSection />

								<Separator />

								{/* Remediation Options Section */}
								<RemediationOptionsSection />

								<Separator />

								{/* Impact Assessment & Dependency Graph */}
								<DependencyGraphSection />

								<Separator />

								{/* Historical Context Section */}
								<HistoricalContextSection />
							</TabsContent>

							<TabsContent value="task-details">
								<Card>
									<CardHeader>
										<CardTitle>Task Details</CardTitle>
										<CardDescription>
											Detailed information about the failed task
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600 text-sm">
											Task details would be displayed here...
										</p>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="cluster-logs">
								<Card>
									<CardHeader>
										<CardTitle>Cluster Logs</CardTitle>
										<CardDescription>
											Spark driver and executor logs
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600 text-sm">
											Cluster logs would be displayed here...
										</p>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="run-history">
								<Card>
									<CardHeader>
										<CardTitle>Run History</CardTitle>
										<CardDescription>
											Historical runs of this job
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-gray-600 text-sm">
											Run history would be displayed here...
										</p>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</ApplicationShell>
	);
}
