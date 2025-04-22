"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export interface MenuItem {
    name: string;
    href: string;
    description?: string;
    children?: MenuItem[];
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    menuData: { [key: string]: { title: string; items: MenuItem[] } };
    sidebarBgColor: string;
    sidebarTextColor: string;
    isMobile?: boolean;
}

export default function Sidebar({
    isOpen,
    onClose,
    menuData,
    sidebarBgColor,
    sidebarTextColor,
    isMobile = false,
}: SidebarProps) {
    const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);


    const handleClose = () => {
        onClose();
        setOpenSubMenus({});
    };


    const handleSubMenuToggle = (parentHref: string) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [parentHref]: !prev[parentHref]
        }));
    };

    /** 링크를 클릭하면 메뉴가 닫히도록 */
    const handleLinkClick = () => {
        handleClose();
    };


    if (!isOpen) {
        return null;
    }

    return (
        <div
            ref={sidebarRef}
            style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: isMobile ? '100%' : '1000px',
                maxWidth: isMobile ? '100vw' : '90vw',
                backgroundColor: sidebarBgColor,
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                zIndex: 101,
                overflowY: 'auto',
                boxShadow: '-2px 0 20px rgba(0, 0, 0, 0.15)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: isMobile ? '15px 0' : '20px 0'
            }}
        >
            {/* Menu 부분 */}
            <div style={{
                display: "flex",
                marginTop: isMobile ? '5vh' : '7vh',
                justifyContent: 'center',
                width: '100%',
                flexWrap: 'wrap'
            }}>
                {Object.entries(menuData).map(([key, menu]) => (
                    <div
                        key={key}
                        style={{
                            marginBottom: '10px',
                            flex: '1',
                            minWidth: isMobile ? '200px' : '250px',
                            maxWidth: isMobile ? '100%' : '300px',
                            padding: '0'
                        }}
                    >
                        {/* Category Title */}
                        <div style={{
                            padding: isMobile ? '12px 12px' : '15px 15px',
                            fontSize: isMobile ? '18px' : '20px',
                            color: sidebarTextColor,
                            fontWeight: '700',
                            letterSpacing: '-0.01em',
                            borderBottom: `1px solid rgba(51, 51, 51, 0.25)`
                        }}>
                            {menu.title}
                        </div>

                        {/* Menu Items List */}
                        <div style={{ marginBottom: isMobile ? '20px' : '30px', marginTop: '10px' }}>
                            {menu.items.map((item) => (
                                <div key={item.href}>
                                    <div
                                        style={{
                                            padding: isMobile ? '10px 12px' : '12px 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: item.children ? 'pointer' : 'default',
                                            color: sidebarTextColor,
                                        }}
                                        onClick={() => item.children && handleSubMenuToggle(item.href)}
                                    >
                                        {!item.children ? (
                                            <Link
                                                href={item.href}
                                                style={{
                                                    color: sidebarTextColor,
                                                    textDecoration: 'none',
                                                    fontSize: isMobile ? '15px' : '16px',
                                                    flexGrow: 1,
                                                    fontWeight: '500',
                                                    letterSpacing: '-0.01em',
                                                }}
                                                onClick={handleLinkClick}
                                            >
                                                {item.name}
                                                {key === 'capabilities' && item.description && (
                                                    <div style={{
                                                        fontSize: isMobile ? '13px' : '14px',
                                                        color: sidebarTextColor,
                                                        marginTop: '5px',
                                                        fontWeight: '400',
                                                        opacity: 0.85
                                                    }}>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </Link>
                                        ) : (
                                            <span style={{
                                                fontSize: isMobile ? '15px' : '16px',
                                                flexGrow: 1,
                                                color: sidebarTextColor,
                                                fontWeight: openSubMenus[item.href] ? '600' : '500',
                                                letterSpacing: '-0.01em',
                                                transition: 'font-weight 0.2s'
                                            }}>
                                                {item.name}
                                                {key === 'capabilities' && item.description && (
                                                    <div style={{
                                                        fontSize: isMobile ? '13px' : '14px',
                                                        color: sidebarTextColor,
                                                        marginTop: '5px',
                                                        fontWeight: '400',
                                                        opacity: 0.85
                                                    }}>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </span>
                                        )}

                                        {item.children && (
                                            openSubMenus[item.href]
                                                ? <ChevronUp size={isMobile ? 16 : 18} color={sidebarTextColor} />
                                                : <ChevronDown size={isMobile ? 16 : 18} color={sidebarTextColor} />
                                        )}
                                    </div>

                                    {item.children && openSubMenus[item.href] && (
                                        <div style={{ paddingLeft: isMobile ? '30px' : '45px', paddingTop: '5px' }}>
                                            {item.children.map((child) => (
                                                <div key={child.href} style={{ padding: isMobile ? '6px 0' : '8px 0' }}>
                                                    <Link
                                                        href={child.href}
                                                        style={{
                                                            display: 'block',
                                                            color: sidebarTextColor,
                                                            textDecoration: 'none',
                                                            fontSize: isMobile ? '14px' : '15px',
                                                            fontWeight: '400',
                                                            letterSpacing: '-0.01em',
                                                        }}
                                                        onClick={handleLinkClick}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}