"use client"

import { useState } from "react"
import { BarChart3Icon, FilterIcon, TrendingUpIcon, UsersIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { SidebarCollapseIcon } from "@databricks/design-system"

import { ApplicationShell } from "@/components/ui/patterns/application-shell"
import { Panel, PanelContent, PanelTrigger } from "@/components/ui/patterns/panel"
import { Button } from "@/components/mini-ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip as TooltipComponent, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function Page() {
	const [showPanel, setShowPanel] = useState(true)
	const [dateRange, setDateRange] = useState("last-30-days")
	const [region, setRegion] = useState("all")
	const [productTypes, setProductTypes] = useState({
		analytics: true,
		compute: true,
		storage: true,
	})
	const [minValue, setMinValue] = useState("")

	const chartData = [
		{ month: "Jan", revenue: 98000 },
		{ month: "Feb", revenue: 105000 },
		{ month: "Mar", revenue: 112000 },
		{ month: "Apr", revenue: 118000 },
		{ month: "May", revenue: 125000 },
		{ month: "Jun", revenue: 132000 },
		{ month: "Jul", revenue: 128000 },
		{ month: "Aug", revenue: 135000 },
		{ month: "Sep", revenue: 142000 },
		{ month: "Oct", revenue: 148000 },
		{ month: "Nov", revenue: 145000 },
		{ month: "Dec", revenue: 152000 },
	]

	const kpiCards = [
		{
			change: "+12.5%",
			icon: <UsersIcon className="size-5" />,
			title: "Total Users",
			value: "24,563",
		},
		{
			change: "+8.2%",
			icon: <TrendingUpIcon className="size-5" />,
			title: "Revenue",
			value: "$148,392",
		},
		{
			change: "+5.4%",
			icon: <BarChart3Icon className="size-5" />,
			title: "Active Sessions",
			value: "12,458",
		},
		{
			change: "-2.1%",
			icon: <FilterIcon className="size-5" />,
			title: "Conversion Rate",
			value: "3.2%",
		},
	]

	const tableData = [
		{ change: "+15.2%", product: "Databricks SQL", region: "North America", revenue: "$45,200", users: 8234 },
		{ change: "+12.8%", product: "Machine Learning", region: "Europe", revenue: "$38,500", users: 6451 },
		{ change: "+18.5%", product: "Delta Lake", region: "Asia Pacific", revenue: "$32,100", users: 5892 },
		{ change: "+9.3%", product: "Data Engineering", region: "North America", revenue: "$28,900", users: 4723 },
		{ change: "+14.7%", product: "MLflow", region: "Europe", revenue: "$21,300", users: 3856 },
		{ change: "+11.2%", product: "Unity Catalog", region: "Asia Pacific", revenue: "$18,700", users: 3214 },
	]

	return (
		<ApplicationShell>
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="border-b border-(--du-bois-color-border) flex items-center gap-2 p-2">
					<div className="flex items-center gap-2">
						<div className="bg-gray-100 rounded-sm flex items-center justify-center h-6 w-6">
							<BarChart3Icon className="size-4" style={{ color: "var(--du-bois-text-secondary)" }} />
						</div>
						<span className="text-sm font-semibold">Analytics Dashboard</span>
					</div>
					<div className="flex flex-1 justify-end">
						<Button
							aria-label="export-data"
							className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 px-3"
							size="sm"
						>
							Export Data
						</Button>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex flex-1 overflow-hidden">
					{/* Main Dashboard Content */}
					<div className="flex flex-1 flex-col overflow-auto">
						<div className="flex-1 p-6">
							{/* KPI Cards */}
							<div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
								{kpiCards.map((card, index) => (
									<div
										key={index}
										className="border border-(--du-bois-color-border) rounded-lg p-6"
										style={{ backgroundColor: "var(--du-bois-background-primary)" }}
									>
										<div className="flex items-center justify-between">
											<div
												className="flex size-12 items-center justify-center rounded-lg"
												style={{ backgroundColor: "var(--du-bois-blue-100)" }}
											>
												<div style={{ color: "var(--du-bois-blue-600)" }}>
													{card.icon}
												</div>
											</div>
											<span
												className={`text-sm font-medium ${
													card.change.startsWith("+")
														? "text-(--du-bois-color-validation-success)"
														: "text-(--du-bois-color-validation-danger)"
												}`}
												style={{
													color: card.change.startsWith("+")
														? "var(--du-bois-text-validation-success)"
														: "var(--du-bois-text-validation-danger)",
												}}
											>
												{card.change}
											</span>
										</div>
										<div className="mt-4">
											<p
												className="text-sm"
												style={{ color: "var(--du-bois-text-secondary)" }}
											>
												{card.title}
											</p>
											<p
												className="mt-1 text-2xl font-semibold"
												style={{ color: "var(--du-bois-text-primary)" }}
											>
												{card.value}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* Revenue Trend Chart */}
							<div
								className="border border-(--du-bois-color-border) mb-8 rounded-lg p-6"
								style={{ backgroundColor: "var(--du-bois-background-primary)" }}
							>
								<h2
									className="mb-4 text-lg font-semibold"
									style={{ color: "var(--du-bois-text-primary)" }}
								>
									Revenue Trend
								</h2>
								<div className="h-80 w-full">
									<ResponsiveContainer height="100%" width="100%">
										<AreaChart
											data={chartData}
											margin={{
												bottom: 5,
												left: 12,
												right: 12,
												top: 5,
											}}
										>
											<defs>
												<linearGradient id="colorRevenue" x1="0" x2="0" y1="0" y2="1">
													<stop
														offset="5%"
														stopColor="var(--du-bois-blue-500)"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="var(--du-bois-blue-500)"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												strokeOpacity={0.2}
												vertical={false}
											/>
											<XAxis
												dataKey="month"
												stroke="var(--du-bois-text-secondary)"
												style={{
													fill: "var(--du-bois-text-secondary)",
													fontSize: "12px",
												}}
												tickLine={false}
											/>
											<YAxis
												stroke="var(--du-bois-text-secondary)"
												style={{
													fill: "var(--du-bois-text-secondary)",
													fontSize: "12px",
												}}
												tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
												tickLine={false}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "var(--du-bois-background-primary)",
													border: "1px solid var(--du-bois-border)",
													borderRadius: "8px",
													color: "var(--du-bois-text-primary)",
												}}
												formatter={(value: number) => [
													`$${value.toLocaleString()}`,
													"Revenue",
												]}
												labelStyle={{
													color: "var(--du-bois-text-secondary)",
													marginBottom: "4px",
												}}
											/>
											<Area
												dataKey="revenue"
												fill="url(#colorRevenue)"
												stroke="var(--du-bois-blue-600)"
												strokeWidth={2}
												type="monotone"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</div>
							</div>

							{/* Data Table */}
							<div
								className="border border-(--du-bois-color-border) rounded-lg"
								style={{ backgroundColor: "var(--du-bois-background-primary)" }}
							>
								<div className="border-b border-(--du-bois-color-border) p-4">
									<h2
										className="text-lg font-semibold"
										style={{ color: "var(--du-bois-text-primary)" }}
									>
										Product Performance
									</h2>
								</div>
								<div className="p-4">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Product</TableHead>
												<TableHead>Region</TableHead>
												<TableHead>Users</TableHead>
												<TableHead>Revenue</TableHead>
												<TableHead>Change</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{tableData.map((row, index) => (
												<TableRow key={index}>
													<TableCell className="font-medium">
														{row.product}
													</TableCell>
													<TableCell>{row.region}</TableCell>
													<TableCell>{row.users.toLocaleString()}</TableCell>
													<TableCell>{row.revenue}</TableCell>
													<TableCell>
														<span
															className="font-medium"
															style={{
																color: row.change.startsWith("+")
																	? "var(--du-bois-text-validation-success)"
																	: "var(--du-bois-text-validation-danger)",
															}}
														>
															{row.change}
														</span>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</div>
					</div>

					{/* Side Panel */}
					{showPanel ? (
						<Panel defaultSize={320} maxSize={480} minSize={280}>
							<PanelContent className="w-full">
								<div className="items-center flex gap-2 p-2">
									<div className="w-full">
										<span style={{ fontWeight: "bold" }}>Filters</span>
									</div>
									<PanelTrigger onClick={() => showPanel && setShowPanel(false)}>
										<TooltipComponent>
											<TooltipTrigger asChild>
												<Button
													aria-label="Collapse panel"
													className="h-6 rounded-sm w-6"
													size="icon"
													variant="ghost"
												>
													<SidebarCollapseIcon
														className="scale-x-[-1]"
														onPointerEnterCapture={undefined}
														onPointerLeaveCapture={undefined}
														style={{
															color: "var(--du-bois-color-text-secondary)",
														}}
													/>
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<span style={{ color: "var(--du-bois-text-white)" }}>
													Collapse panel
												</span>
											</TooltipContent>
										</TooltipComponent>
									</PanelTrigger>
								</div>

								{/* Filter Content */}
								<div className="flex-1 overflow-auto p-4">
									<div className="flex flex-col gap-6">
										{/* Date Range Filter */}
										<div className="flex flex-col gap-2">
											<Label
												className="text-sm font-medium"
												htmlFor="date-range"
												style={{ color: "var(--du-bois-text-primary)" }}
											>
												Date Range
											</Label>
											<Select value={dateRange} onValueChange={setDateRange}>
												<SelectTrigger className="w-full" id="date-range">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="last-7-days">Last 7 days</SelectItem>
													<SelectItem value="last-30-days">Last 30 days</SelectItem>
													<SelectItem value="last-90-days">Last 90 days</SelectItem>
													<SelectItem value="last-year">Last year</SelectItem>
													<SelectItem value="all-time">All time</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Region Filter */}
										<div className="flex flex-col gap-2">
											<Label
												className="text-sm font-medium"
												htmlFor="region"
												style={{ color: "var(--du-bois-text-primary)" }}
											>
												Region
											</Label>
											<Select value={region} onValueChange={setRegion}>
												<SelectTrigger className="w-full" id="region">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">All Regions</SelectItem>
													<SelectItem value="north-america">North America</SelectItem>
													<SelectItem value="europe">Europe</SelectItem>
													<SelectItem value="asia-pacific">Asia Pacific</SelectItem>
													<SelectItem value="latin-america">Latin America</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Product Type Filter */}
										<div className="flex flex-col gap-2">
											<Label
												className="mb-2 text-sm font-medium"
												style={{ color: "var(--du-bois-text-primary)" }}
											>
												Product Types
											</Label>
											<div className="flex flex-col gap-3">
												<div className="flex items-center gap-2">
													<Checkbox
														checked={productTypes.analytics}
														id="analytics"
														onCheckedChange={(checked) =>
															setProductTypes({
																...productTypes,
																analytics: checked as boolean,
															})
														}
													/>
													<Label
														className="text-sm"
														htmlFor="analytics"
														style={{ color: "var(--du-bois-text-secondary)" }}
													>
														Analytics
													</Label>
												</div>
												<div className="flex items-center gap-2">
													<Checkbox
														checked={productTypes.compute}
														id="compute"
														onCheckedChange={(checked) =>
															setProductTypes({
																...productTypes,
																compute: checked as boolean,
															})
														}
													/>
													<Label
														className="text-sm"
														htmlFor="compute"
														style={{ color: "var(--du-bois-text-secondary)" }}
													>
														Compute
													</Label>
												</div>
												<div className="flex items-center gap-2">
													<Checkbox
														checked={productTypes.storage}
														id="storage"
														onCheckedChange={(checked) =>
															setProductTypes({
																...productTypes,
																storage: checked as boolean,
															})
														}
													/>
													<Label
														className="text-sm"
														htmlFor="storage"
														style={{ color: "var(--du-bois-text-secondary)" }}
													>
														Storage
													</Label>
												</div>
											</div>
										</div>

										{/* Minimum Value Filter */}
										<div className="flex flex-col gap-2">
											<Label
												className="text-sm font-medium"
												htmlFor="min-value"
												style={{ color: "var(--du-bois-text-primary)" }}
											>
												Minimum Revenue
											</Label>
											<Input
												id="min-value"
												placeholder="e.g., 10000"
												type="number"
												value={minValue}
												onChange={(e) => setMinValue(e.target.value)}
											/>
										</div>

										{/* Divider */}
										<div className="border-t border-(--du-bois-color-border)" />

										{/* Action Buttons */}
										<div className="flex flex-col gap-2">
											<Button
												className="bg-(--du-bois-blue-600) rounded-sm text-[13px] h-8 w-full"
												size="sm"
											>
												Apply Filters
											</Button>
											<Button
												className="rounded-sm text-[13px] h-8 w-full"
												size="sm"
												variant="outline"
												onClick={() => {
													setDateRange("last-30-days")
													setRegion("all")
													setProductTypes({
														analytics: true,
														compute: true,
														storage: true,
													})
													setMinValue("")
												}}
											>
												Reset Filters
											</Button>
										</div>

										{/* Filter Summary */}
										<div
											className="rounded-lg p-3"
											style={{ backgroundColor: "var(--du-bois-background-secondary)" }}
										>
											<p
												className="mb-2 text-xs font-medium"
												style={{ color: "var(--du-bois-text-secondary)" }}
											>
												Active Filters
											</p>
											<div className="flex flex-col gap-1">
												<p
													className="text-xs"
													style={{ color: "var(--du-bois-text-primary)" }}
												>
													Date: {dateRange.replace(/-/g, " ")}
												</p>
												<p
													className="text-xs"
													style={{ color: "var(--du-bois-text-primary)" }}
												>
													Region: {region.replace(/-/g, " ")}
												</p>
												<p
													className="text-xs"
													style={{ color: "var(--du-bois-text-primary)" }}
												>
													Products:{" "}
													{Object.entries(productTypes)
														.filter(([, checked]) => checked)
														.map(([type]) => type)
														.join(", ")}
												</p>
												{minValue && (
													<p
														className="text-xs"
														style={{ color: "var(--du-bois-text-primary)" }}
													>
														Min Revenue: ${minValue}
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							</PanelContent>
						</Panel>
					) : (
						<div className="border-l border-(--du-bois-color-border) p-2">
							<TooltipComponent>
								<TooltipTrigger onClick={(e) => e.stopPropagation()}>
									<Button
										aria-label="open-panel"
										className="rounded-sm h-6 w-6"
										onClick={() => setShowPanel(true)}
										size="icon"
										variant="ghost"
									>
										<SidebarCollapseIcon
											onPointerEnterCapture={undefined}
											onPointerLeaveCapture={undefined}
											style={{
												color: "var(--du-bois-color-text-secondary)",
											}}
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<span style={{ color: "var(--du-bois-text-white)" }}>
										Expand side panel
									</span>
								</TooltipContent>
							</TooltipComponent>
						</div>
					)}
				</div>
			</div>
		</ApplicationShell>
	)
}
