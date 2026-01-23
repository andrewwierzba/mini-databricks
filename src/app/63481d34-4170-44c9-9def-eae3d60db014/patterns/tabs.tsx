"use client";

import * as React from "react";

import { CloseSmallIcon, ColumnSplitIcon, FileCodeIcon, PlusIcon } from "@databricks/design-system";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs components must be used within a Tabs component");
	}
	return context;
}

interface TabProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: React.ComponentType<any>;
	isActive?: boolean;
	label?: string;
	value: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onClose?: () => void;
}

function Tab({ icon: Icon, isActive = false, label = "Tab", onClick, onClose }: TabProps) {
	const IconComponent = Icon || FileCodeIcon;
	return (
		<div
			aria-selected={isActive}
			className={`group items-center border-r border-[var(--du-bois-color-border)] cursor-pointer flex gap-1.5 px-2 py-2 ${
				isActive ? "bg-[var(--du-bois-color-background-primary)]" : "hover:bg-accent border-b"
			}`}
			onClick={onClick}
            role="tab"
		>
			<IconComponent
				onPointerEnterCapture={undefined}
				onPointerLeaveCapture={undefined}
				style={{
					color: 'var(--du-bois-color-text-secondary)'
				}}
			/>
			<span className="text-[13px] pointer-events-none text-nowrap">{label}</span>
            {onClose && (
                <Tooltip>
                    <TooltipTrigger
                        className={`h-6 w-6 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                    <Button
                        aria-label="close-editor-tab"
                        className="rounded-sm h-6 w-6"
                        size="icon"
                        variant="ghost"
                    >
                        <CloseSmallIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <span style={{ color: 'var(--du-bois-text-white)' }}>
                        Close
                    </span>
                </TooltipContent>
                </Tooltip>
            )}
		</div>
	);
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: React.ComponentType<any>;
	value: string;
	onClose?: () => void;
}

export function TabsTrigger({ icon, value, children, onClose, ...props }: TabsTriggerProps) {
	const { value: activeValue, onValueChange } = useTabsContext();
	const isActive = activeValue === value;

	return (
		<Tab
			icon={icon}
			isActive={isActive}
			label={typeof children === "string" ? children : value}
			value={value}
			onClick={() => onValueChange(value)}
			onClose={onClose}
		/>
	);
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    asChild?: boolean
    value: string
}

export function TabsContent({ asChild = false, children, value, ...props }: TabsContentProps) {
	const { value: activeValue } = useTabsContext();
	
	if (activeValue !== value) {
		return null;
	}

	return (
		<div aria-label="tabs-content" role="tabpanel" {...props}>
			{children}
		</div>
	);
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
	splitView?: boolean;
}

export function TabsList({ children, splitView = true, ...props }: TabsListProps) {
	return (
		<div
			aria-label="tabs"
			className="bg-[var(--du-bois-color-background-secondary)] flex"
            role="tablist"
			{...props}
		>
			<div className="flex overflow-x-auto overflow-y-hidden">
				{children}
			</div>
			<div className="items-center border-b border-[var(--du-bois-color-border)] flex px-2">
                <Button
                    aria-label="new-tab"
                    className="rounded-sm h-6 w-6"
                    size="icon"
                    variant="ghost"
                >
                    <PlusIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Button>
            </div>
			<div className="items-center border-b border-[var(--du-bois-color-border)] flex flex-1 justify-end px-2">
				{splitView && (
					<Tooltip>
						<TooltipTrigger className="h-6 w-6">
							<Button
								aria-label="split-view"
								className="rounded-sm h-6 w-6"
								size="icon"
								variant="ghost"
							>
								<ColumnSplitIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<span style={{ color: 'var(--du-bois-text-white)' }}>
								Split editor right
							</span>
						</TooltipContent>
					</Tooltip>
				)}
			</div>
		</div>
	);
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	value?: string;
}

export function Tabs({ 
    children, 
	defaultValue, 
	onValueChange, 
	value: controlledValue, 
	...props 
}: TabsProps) {
	const [internalValue, setInternalValue] = React.useState(defaultValue || "");
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;

	const handleValueChange = React.useCallback((newValue: string) => {
		if (!isControlled) {
			setInternalValue(newValue);
		}
		onValueChange?.(newValue);
	}, [isControlled, onValueChange]);

	const contextValue = React.useMemo(
		() => ({
			value: currentValue,
			onValueChange: handleValueChange,
		}),
		[currentValue, handleValueChange]
	);

	return (
		<TabsContext.Provider value={contextValue}>
			<div role="tablist" aria-label="tabs" {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}
