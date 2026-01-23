"use client";

import { StoreIcon } from "lucide-react";

import { CatalogIcon, ChecklistIcon, ClockIcon, CloudIcon, CloudDatabaseIcon, DashboardIcon, GridIcon, HistoryIcon, NotebookIcon, NotificationIcon, PlusIcon, QueryEditorIcon, QueryIcon, SparkleRectangleIcon, WorkflowsIcon, WorkspacesIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";

interface NavigationGroup {
    items: NavigationItem[];
    name?: string;
}

interface NavigationItem {
    href: string;
    icon: React.ReactNode;
    name: string;
}

const defaultNavigationItems: NavigationGroup[] = [{
    items: [{
        href: "/workspace",
        icon: <NotebookIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Workspace"
    }, {
        href: "/recents",
        icon: <ClockIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Recents"
    }, {
        href: "/catalog",
        icon: <CatalogIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Catalog"
    }, {
        href: "/jobs",
        icon: <WorkflowsIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Jobs & Pipelines"
    }, {
        href: "/compute",
        icon: <CloudIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Compute"
    }, {
        href: "/discover",
        icon: <GridIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Discover"
    }, {
        href: "/marketplace",
        icon: <StoreIcon />,
        name: "Marketplace"
    }]
}, {
    items: [{
        href: "/sql",
        icon: <QueryEditorIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "SQL Editor"
    }, {
        href: "/query",
        icon: <QueryIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Queries"
    }, {
        href: "/dashboards",
        icon: <DashboardIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Dashboards"
    }, {
        href: "/genie",
        icon: <SparkleRectangleIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Genie"
    }, {
        href: "/alerts",
        icon: <NotificationIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Alerts"
    }, {
        href: "/query-history",
        icon: <HistoryIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Query History"
    }, {
        href: "/sql-warehouses",
        icon: <CloudDatabaseIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "SQL Warehouses"
    }],
    name: "SQL"
}, {
    items: [{
        href: "/runs",
        icon: <ChecklistIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Runs"
    }, {
        href: "/data-ingestion",
        icon: <WorkspacesIcon className="rotate-90" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        name: "Data Ingestion"
    }],
    name: "Data Engineering"
}];

interface NavigationProps {
    defaultWidth?: string;
    minWidth?: string;
    navigationItems?: NavigationGroup[];
    onClose: () => void;
}

export function Navigation({
    defaultWidth = "200px",
    minWidth = "200px",
    navigationItems = defaultNavigationItems,
}: NavigationProps) {
    return (
        <nav
            aria-label="navigation"
            className="flex flex-col gap-2 h-full overflow-x-hidden overflow-y-auto px-2 text-sm [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:opacity-0 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:transition-opacity [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-color:rgb(209_213_219)_transparent] [scrollbar-width:thin] hover:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:opacity-100"
            style={{
                minWidth: minWidth,
                width: defaultWidth
            }}
        >
            <Button className="rounded-sm h-8 justify-start mb-1 px-2 py-1">
                <span aria-label="icon">
                    <PlusIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </span>
                <span aria-label="new">New</span>
            </Button>

            {navigationItems.map((group) => (
                <div className="flex flex-col gap-2" key={group.name}>
                    {/* Navigation group name */}
                    {group.name && <span className="text-gray-500 px-2 py-1">{group.name}</span>}

                    {/* Navigation group items */}
                    <div className="flex flex-col gap-1">
                        {group.items.map((item) => (
                            <Button
                                aria-label={item.name}
                                className="group rounded-sm justify-start px-2 hover:bg-sky-600/10 hover:text-sky-800"
                                key={item.href}
                                size="sm"
                                variant="ghost"
                            >
                                <span aria-label="icon" className="text-gray-500 group-hover:text-sky-800">
                                    {item.icon}
                                </span>
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    )
}