"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { ChevronDownIcon } from "@/icons";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import { mainNavItems, othersNavItems, type NavItem } from "@/components/layout/nav-items";

type MenuType = "main" | "others";

type OpenSubmenu = { type: MenuType; index: number } | null;

/** Tìm submenu chứa route hiện tại — derive thuần, không effect state. */
function findActiveSubmenu(isActive: (path: string) => boolean): OpenSubmenu {
  let matched: OpenSubmenu = null;
  (["main", "others"] as const).forEach((menuType) => {
    const items = menuType === "main" ? mainNavItems : othersNavItems;
    items.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          matched = { type: menuType, index };
        }
      });
    });
  });
  return matched;
}

const SECTION_LABELS: Record<MenuType, string> = { main: "Menu", others: "Others" };

/**
 * Sidebar rail-gọn:
 * - Mặc định luôn là rail hẹp (64px) — nội dung không bị push.
 * - Hover vào rail → overlay bung rộng 240px đè lên nội dung (KHÔNG shift layout).
 * - Nút pin trong panel bung → giữ mở rộng + push nội dung; bấm bỏ pin → về rail.
 */
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [manualSubmenu, setManualSubmenu] = useState<OpenSubmenu>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Submenu mở = override tạm của user, ngược lại derive từ pathname
  // (isActive đã đổi theo pathname nên không cần đưa pathname vào deps).
  const openSubmenu: OpenSubmenu = useMemo(
    () => manualSubmenu ?? findActiveSubmenu(isActive),
    [manualSubmenu, isActive],
  );

  // Rail luôn nhỏ; panel nội dung đầy đủ hiện khi: mobile drawer, hover, hoặc pinned.
  const showContent = isMobileOpen || isHovered || isExpanded;

  // Đo chiều cao submenu mỗi lần panel bung để animate height đúng.
  const openKey = openSubmenu ? `${openSubmenu.type}-${openSubmenu.index}` : null;
  useEffect(() => {
    if (!openKey || !showContent) return;
    const el = subMenuRefs.current[openKey];
    if (el) {
      setSubMenuHeight((prev) => ({ ...prev, [openKey]: el.scrollHeight }));
    }
  }, [openKey, showContent]);

  const handleSubmenuToggle = (index: number, menuType: MenuType) => {
    setManualSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index },
    );
  };

  const isSubmenuOpen = (menuType: MenuType, index: number) =>
    openSubmenu?.type === menuType && openSubmenu?.index === index;

  const renderMenuItems = (navItems: NavItem[], menuType: MenuType) => (
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => {
        const subActive = nav.subItems?.some((s) => isActive(s.path)) ?? false;
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                title={showContent ? undefined : nav.name}
                className={`menu-item group cursor-pointer ${
                  isSubmenuOpen(menuType, index) || subActive
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${showContent ? "lg:justify-start" : "lg:justify-center"}`}
              >
                <span
                  className={`${
                    isSubmenuOpen(menuType, index) || subActive
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {showContent && <span className="menu-item-text">{nav.name}</span>}
                {showContent && (
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                      isSubmenuOpen(menuType, index) ? "text-brand-500 rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  title={showContent ? undefined : nav.name}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {showContent && <span className="menu-item-text">{nav.name}</span>}
                </Link>
              )
            )}
            {nav.subItems && showContent && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen(menuType, index)
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-1 ml-9 space-y-1">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="ml-auto flex items-center gap-1">
                          {subItem.new && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 transition-[width,transform] duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${
        showContent ? SIDEBAR_CLASSES.widthExpanded : SIDEBAR_CLASSES.widthCollapsed
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className={`flex py-4 ${showContent ? "justify-start px-3" : "justify-center"}`}>
        {showContent ? (
          <div className="flex w-full items-center justify-between gap-2">
            <Link href="/">
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={130}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={130}
                height={32}
              />
            </Link>
            <button
              onClick={toggleSidebar}
              aria-label={isExpanded ? "Bỏ ghim sidebar" : "Ghim sidebar mở rộng"}
              title={isExpanded ? "Bỏ ghim (sidebar về rail)" : "Ghim (giữ mở rộng, đẩy nội dung)"}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
            >
              {isExpanded ? (
                // icon unpin (ghim nghiêng có gạch)
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17v5" />
                  <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                // icon pin
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17v5" />
                  <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
                </svg>
              )}
            </button>
          </div>
        ) : (
          <Link href="/">
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex flex-1 flex-col overflow-x-hidden overflow-y-auto duration-300 ease-linear">
        <nav className={`mb-6 ${showContent ? "px-3" : "px-2"}`}>
          <div className="flex flex-col gap-4">
            {(["main", "others"] as const).map((menuType) => (
              <div key={menuType}>
                <h2
                  className={`mb-3 flex text-xs leading-[20px] text-gray-400 uppercase ${
                    showContent ? "justify-start px-2" : "justify-center"
                  }`}
                >
                  {showContent ? (
                    SECTION_LABELS[menuType]
                  ) : (
                    <span className="tracking-widest">•••</span>
                  )}
                </h2>
                {renderMenuItems(menuType === "main" ? mainNavItems : othersNavItems, menuType)}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
