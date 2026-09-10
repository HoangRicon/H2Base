"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { AngleLeftIcon, AngleRightIcon } from "@/icons";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import { navSections, type NavSection } from "@/components/layout/nav-items";

/**
 * Sidebar 2 tầng (kiểu ảnh tham chiếu):
 * - Rail hẹp có NHÃN dưới icon — mặc định luôn ở đó, không bung khi hover.
 * - Section có menu con: bấm tile → panel rộng hiện CẠNH rail (overlay, không push nội dung).
 * - Quá nhiều icon → rail cuộn dọc; nút mở/đóng panel ghim ĐÁY rail, luôn ở chỗ đó.
 */
const AppSidebar: React.FC = () => {
  const { isMobileOpen, isSubmenuOpen, toggleSubmenuPanel, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  // Section user bấm gần nhất — null = chưa bấm thì derive theo route.
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const pathMatches = (path: string) => path === pathname;

  const isSectionActive = (section: NavSection) =>
    (section.path ? pathMatches(section.path) : false) ||
    (section.items?.some((item) => pathMatches(item.path)) ?? false);

  const activeIdx = navSections.findIndex((s) => isSectionActive(s));
  const defaultIdx = activeIdx >= 0 ? activeIdx : 0;
  const panelIndex = selectedSection ?? defaultIdx;
  const panelSection = navSections[panelIndex];
  const panelHasItems = !!panelSection?.items?.length;

  // Bấm tile section cha: đổi section trong panel; bấm lại section đang mở → đóng panel.
  const handleSectionClick = (index: number) => {
    if (isSubmenuOpen && panelIndex === index) {
      toggleSubmenuPanel();
      return;
    }
    setSelectedSection(index);
    if (!isSubmenuOpen) toggleSubmenuPanel();
  };

  const tileClass = (active: boolean) =>
    `flex h-[68px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-1 transition-colors ${
      active ? "bg-brand-50 dark:bg-brand-500/[0.12]" : "hover:bg-gray-100 dark:hover:bg-white/5"
    }`;
  const labelClass = (active: boolean) =>
    `text-center text-[10px] leading-tight ${
      active
        ? "font-semibold text-brand-500 dark:text-brand-400"
        : "text-gray-500 dark:text-gray-400"
    }`;

  return (
    <>
      {/* ===== Rail hẹp ===== */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.railWidth} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex shrink-0 justify-center py-4">
          <Link href="/">
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={36} height={36} />
          </Link>
        </div>

        {/* Tile cuộn độc lập khi overflow — nút đáy không cuộn theo */}
        <nav className="no-scrollbar flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3">
          <ul className="flex flex-col gap-1">
            {navSections.map((section, index) => {
              const active = isSectionActive(section);
              const content = (
                <>
                  <span
                    className={
                      active
                        ? "text-brand-500 dark:text-brand-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {section.icon}
                  </span>
                  <span className={labelClass(active)}>{section.name}</span>
                </>
              );
              return (
                <li key={section.name}>
                  {section.items?.length ? (
                    <button
                      type="button"
                      onClick={() => handleSectionClick(index)}
                      aria-expanded={isSubmenuOpen && panelIndex === index}
                      className={tileClass(active)}
                    >
                      {content}
                    </button>
                  ) : (
                    <Link href={section.path ?? "/"} className={tileClass(active)}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Nút mở/đóng panel — ghim đáy rail */}
        <div className="flex shrink-0 justify-center border-t border-gray-100 py-2.5 dark:border-gray-800">
          <button
            type="button"
            onClick={toggleSubmenuPanel}
            aria-label={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
            title={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          >
            {isSubmenuOpen ? (
              <AngleLeftIcon className="h-5 w-5" />
            ) : (
              <AngleRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {/* ===== Panel menu con — sát cạnh rail, overlay ===== */}
      {isSubmenuOpen && panelHasItems && (
        <div
          className={`shadow-theme-md fixed top-0 z-30 h-screen overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.panelLeft} ${SIDEBAR_CLASSES.panelWidth}`}
        >
          <div className="px-4 py-5">
            <h2 className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
              {panelSection.name}
            </h2>
            <ul className="mt-3 flex flex-col gap-0.5">
              {panelSection.items?.map((item) => {
                const active = pathMatches(item.path);
                return (
                  <li key={`${panelSection.name}-${item.name}`}>
                    <Link
                      href={item.path}
                      className={`menu-dropdown-item ${
                        active ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {item.name}
                      <span className="ml-auto flex items-center gap-1">
                        {item.new && (
                          <span
                            className={`menu-dropdown-badge ${
                              active ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            }`}
                          >
                            new
                          </span>
                        )}
                        {item.pro && (
                          <span
                            className={`menu-dropdown-badge ${
                              active ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            }`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Backdrop mobile khi rail mở dạng drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default AppSidebar;
