"use client"

import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
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
}

export default function Sidebar({
    isOpen,
    onClose,
    menuData,
    sidebarBgColor,
    sidebarTextColor,
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
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '1000px',
                maxWidth: '90vw',
                backgroundColor: sidebarBgColor, zIndex: 100, overflowY: 'auto',
                boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-out',
                padding: '20px 0'
            }}
        >
            {/* 닫기버튼 */}
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: sidebarTextColor }}
                    onClick={handleClose}
                    aria-label="Close menu"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Menu 부분 */}
            <div style={{ display: "flex", marginTop: '7vh', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
                {Object.entries(menuData).map(([key, menu]) => (
                    <div
                        key={key}
                        style={{
                            marginBottom: '10px', flex: '1', minWidth: '250px', maxWidth: '300px', padding: '0'
                        }}
                    >
                        {/* Category Title */}
                        <div style={{ padding: '15px 15px', fontSize: '18px', color: sidebarTextColor, fontWeight: 'bold', borderBottom: `1px solid ${sidebarTextColor}` }}>
                            {menu.title}
                        </div>

                        {/* Menu Items List */}
                        <div style={{ marginBottom: '30px', marginTop: '10px' }}>
                            {menu.items.map((item) => (
                                <div key={item.href}>
                                    <div
                                        style={{
                                            padding: '12px 15px',
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
                                                    fontSize: '15px',
                                                    flexGrow: 1,
                                                    fontWeight: 'normal',
                                                }}
                                                onClick={handleLinkClick}
                                            >
                                                {item.name}
                                                {key === 'capabilities' && item.description && (
                                                    <div style={{ fontSize: '13px', color: sidebarTextColor, marginTop: '5px', fontWeight: 'normal' }}>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </Link>
                                        ) : (
                                            <span style={{
                                                fontSize: '15px',
                                                flexGrow: 1,
                                                color: sidebarTextColor,
                                                fontWeight: openSubMenus[item.href] ? 'bold' : 'normal',
                                                transition: 'font-weight 0.2s'
                                            }}>
                                                {item.name}
                                                {key === 'capabilities' && item.description && (
                                                    <div style={{ fontSize: '13px', color: sidebarTextColor, marginTop: '5px', fontWeight: 'normal' }}>
                                                        {item.description}
                                                    </div>
                                                )}
                                            </span>
                                        )}


                                        {item.children && (
                                            openSubMenus[item.href]
                                                ? <ChevronUp size={18} color={sidebarTextColor} />
                                                : <ChevronDown size={18} color={sidebarTextColor} />
                                        )}
                                    </div>


                                    {item.children && openSubMenus[item.href] && (
                                        <div style={{ paddingLeft: '45px', paddingTop: '5px' }}>
                                            {item.children.map((child) => (
                                                <div key={child.href} style={{ padding: '8px 0' }}>
                                                    <Link
                                                        href={child.href}
                                                        style={{
                                                            display: 'block',
                                                            color: sidebarTextColor,
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
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