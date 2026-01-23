import { useState } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { ChevronDownIcon, ChevronRightIcon, FileIcon, FolderFillIcon, HomeIcon, StarIcon, TrashIcon, UserGroupIcon } from "@databricks/design-system";

interface LinkProps {
    description?: string;
    href?: string;
    icon?: React.ReactNode;
    sublinks?: LinkProps[];
    title: string;
};

interface Props {
    activeItem?: string;
    links?: LinkProps[];
}

export default function Panel({ 
    activeItem = "New Job 2026-01-01 23:59:59",
    links = [{
        icon: <HomeIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        title: "Home",
    }, {
        icon: 
            <span className="inline-flex text-sky-400">
                <FolderFillIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </span>,
        sublinks: [{
            icon: <UserGroupIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
            sublinks: [{
                icon: <HomeIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                sublinks: [{
                    icon: 
                        <span className="inline-flex text-sky-400">
                            <FolderFillIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </span>,
                    title: "New Job 2026-01-01 23:59:59",
                }],
                title: "first.surname@databricks.com",
            }],
            title: "Users",
        }, {
            icon: 
                <span className="inline-flex text-sky-400">
                    <FolderFillIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </span>,
            sublinks: [{
                icon: <FileIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
                title: "Filename 001",
            }],
            title: "Projects",
        }],
        title: "Workspace",
    }, {
        icon: <StarIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        title: "Favorites",
    }, {
        icon: <TrashIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        title: "Trash",
    }],
}: Props) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    return (
        <div aria-label="panel-workspace" className="bg-white h-full overflow-y-auto p-2 w-full">
            {links.map((link, index) => {
                const hasSublinks = link.sublinks && link.sublinks.length > 0;
                const isActive = activeItem === link.title || activeItem === link.href;
                const isOpen = openItems.has(String(index));
                
                return (
                    <div key={`panel-workspace-link-${index}`}>
                        <div 
                            className={cn(
                                "items-center border-transparent border-l-4 flex text-sm gap-2 px-3 py-0.5",
                                isActive && "bg-sky-600/8 border-sky-600"
                            )} 
                            data-active={isActive}
                        >
                            {hasSublinks ? (
                                <div
                                    className="text-neutral-500 cursor-pointer"
                                    onClick={() => {
                                        setOpenItems(prev => {
                                            const next = new Set(prev);
                                            const key = String(index);
                                            if (next.has(key)) {
                                                next.delete(key);
                                            } else {
                                                next.add(key);
                                            }
                                            return next;
                                        });
                                    }}
                                >
                                    {isOpen ?
                                          <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                        : <ChevronRightIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                    }
                                </div>
                            ) : (
                                <div className="w-4" />
                            )}
                            <Link href={link.href ?? "#"} className="flex-1 min-w-0">
                                <div
                                    aria-label="panel-workspace-link"
                                    className="items-center flex gap-2 min-w-0"
                                >
                                    <span className="inline-flex text-neutral-500 shrink-0">{link.icon}</span>
                                    <span className="truncate">{link.title}</span>
                                </div>
                            </Link>
                        </div>
                        {hasSublinks && isOpen && link.sublinks && (
                            <>
                                {link.sublinks.map((sublink, subIndex) => {
                                    const hasSubSublinks = sublink.sublinks && sublink.sublinks.length > 0;
                                    const isSubActive = activeItem === sublink.title || activeItem === sublink.href;
                                    const subKey = `${index}-${subIndex}`;
                                    const isSubOpen = openItems.has(subKey);
                                    
                                    return (
                                        <div key={`panel-workspace-sublink-${index}-${subIndex}`}>
                                            <div
                                                className={cn(
                                                    "items-center border-transparent border-l-4 flex text-sm gap-2 px-3 py-0.5 pl-9",
                                                    isSubActive && "bg-sky-600/8 border-sky-600"
                                                )}
                                                data-active={isSubActive}
                                            >
                                                {hasSubSublinks ? (
                                                    <div
                                                        className="text-neutral-500 cursor-pointer"
                                                        onClick={() => {
                                                            setOpenItems(prev => {
                                                                const next = new Set(prev);
                                                                if (next.has(subKey)) {
                                                                    next.delete(subKey);
                                                                } else {
                                                                    next.add(subKey);
                                                                }
                                                                return next;
                                                            });
                                                        }}
                                                    >
                                                        {isSubOpen ?
                                                              <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                            : <ChevronRightIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                        }
                                                    </div>
                                                ) : (
                                                    <div className="w-4" />
                                                )}
                                                <Link href={sublink.href ?? "#"} className="flex-1 min-w-0">
                                                    <div
                                                        aria-label="panel-workspace-sublink"
                                                        className="items-center flex gap-2 min-w-0"
                                                    >
                                                        <span className="inline-flex text-neutral-500 shrink-0">{sublink.icon}</span>
                                                        <span className="truncate">{sublink.title}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                            {hasSubSublinks && isSubOpen && sublink.sublinks && (
                                                <>
                                                    {sublink.sublinks.map((subSubLink, subSubIndex) => {
                                                        const hasSubSubSublinks = subSubLink.sublinks && subSubLink.sublinks.length > 0;
                                                        const isSubSubActive = activeItem === subSubLink.title || activeItem === subSubLink.href;
                                                        const subSubKey = `${index}-${subIndex}-${subSubIndex}`;
                                                        const isSubSubOpen = openItems.has(subSubKey);
                                                        
                                                        return (
                                                            <div key={`panel-workspace-sub-sublink-${index}-${subIndex}-${subSubIndex}`}>
                                                                <div
                                                                    className={cn(
                                                                        "items-center border-transparent border-l-4 flex text-sm gap-2 px-3 py-0.5 pl-[3.75rem]",
                                                                        isSubSubActive && "bg-sky-600/8 border-sky-600"
                                                                    )}
                                                                    data-active={isSubSubActive}
                                                                >
                                                                    {hasSubSubSublinks ? (
                                                                        <div
                                                                            className="text-neutral-500 cursor-pointer"
                                                                            onClick={() => {
                                                                                setOpenItems(prev => {
                                                                                    const next = new Set(prev);
                                                                                    if (next.has(subSubKey)) {
                                                                                        next.delete(subSubKey);
                                                                                    } else {
                                                                                        next.add(subSubKey);
                                                                                    }
                                                                                    return next;
                                                                                });
                                                                            }}
                                                                        >
                                                                            {isSubSubOpen ?
                                                                                  <ChevronDownIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                                                : <ChevronRightIcon onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-4" />
                                                                    )}
                                                                    <Link href={subSubLink.href ?? "#"} className="flex-1 min-w-0">
                                                                        <div
                                                                            aria-label="panel-workspace-sub-sublink"
                                                                            className="items-center flex gap-2 min-w-0"
                                                                        >
                                                                            <span className="inline-flex text-neutral-500 shrink-0">{subSubLink.icon}</span>
                                                                            <span className="truncate">{subSubLink.title}</span>
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                                {hasSubSubSublinks && isSubSubOpen && subSubLink.sublinks && (
                                                                    <>
                                                                        {subSubLink.sublinks.map((subSubSubLink, subSubSubIndex) => {
                                                                            const isSubSubSubActive = activeItem === subSubSubLink.title || activeItem === subSubSubLink.href;
                                                                            
                                                                            return (
                                                                                <div
                                                                                    key={`panel-workspace-sub-sub-sublink-${index}-${subIndex}-${subSubIndex}-${subSubSubIndex}`}
                                                                                    className={cn(
                                                                                        "items-center border-transparent border-l-4 flex text-sm gap-2 px-3 py-0.5 pl-[3.75rem]",
                                                                                        isSubSubSubActive && "bg-sky-600/8 border-sky-600"
                                                                                    )}
                                                                                    data-active={isSubSubSubActive}
                                                                                >
                                                                                    <div className="w-4" />
                                                                                    <Link href={subSubSubLink.href ?? "#"} className="flex-1 min-w-0">
                                                                                        <div
                                                                                            aria-label="panel-workspace-sub-sub-sublink"
                                                                                            className="items-center flex gap-2 min-w-0"
                                                                                        >
                                                                                            <span className="inline-flex text-neutral-500 shrink-0">{subSubSubLink.icon}</span>
                                                                                            <span className="truncate">{subSubSubLink.title}</span>
                                                                                        </div>
                                                                                    </Link>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
