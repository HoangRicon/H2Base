"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { AngleLeftIcon, AngleRightIcon } from "@/icons";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import { navSections, type NavSection } from "@/components/layout/nav-items";

/**
 * Sidebar 2 tầng nằm TRONG FLOW (flex cùng header/content — không fixed đè header):
 * - Rail hẹp icon + nhãn dưới icon, luôn ở đó (mobile: drawer).
 * - Bấm section có menu con / nút đáy rail → panel rộng PUSH nội dung sang phải
 *   (animate width, không overlay).
 * - Nút mở/đóng ở ĐÁY rail, đổi màu phân biệt đang mở / đang đóng.
 * - Quá nhiều icon: rail cuộn dọc, nút đáy đứng yên.
 */
const AppSidebar: React.FC = () => {
  const {
    isMobileOpen,
    isSubmenuOpen,
    toggleSubmenuPanel,
    toggleMobileSidebar,
    selectedSection,
    setSelectedSection,
  } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const pathMatches = (path: string) => path === pathname;

  const isSectionActive = (section: NavSection) =>
    (section.path ? pathMatches(section.path) : false) ||
    (section.items?.some((item) => pathMatches(item.path)) ?? false);

  const activeIdx = navSections.findIndex((s) => isSectionActive(s));
  const defaultIdx = activeIdx >= 0 ? activeIdx : 0;
  const panelIndex = selectedSection ?? defaultIdx;
  const panelSection = navSections[panelIndex];
  const panelHasItems = !!panelSection?.items?.length;

  const showPanel = isSubmenuOpen && panelHasItems;

  // Link đơn trong drawer mobile: chọn xong thì đóng drawer.
  const closeMobileDrawer = () => {
    if (window.innerWidth < 768 && isMobileOpen) toggleMobileSidebar();
  };

  // Bấm tile section cha: đổi section trong panel; bấm lại section đang mở → đóng panel.
  // Trên mobile (panel không hiện): đưa tới trang con đầu tiên của section.
  const handleSectionClick = (index: number) => {
    if (window.innerWidth < 768) {
      const first = navSections[index]?.items?.[0];
      if (first) {
        router.push(first.path);
        closeMobileDrawer();
      }
      return;
    }
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

  // Nội dung dùng chung cho rail desktop lẫn drawer mobile.
  const railInner = (
    <>
      <div className="flex shrink-0 justify-center py-4">
        <Link href="/">
          <Image src="/images/logo/logo-icon.svg" alt="Logo" width={36} height={36} />
        </Link>
      </div>

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
                  <Link
                    href={section.path ?? "/"}
                    className={tileClass(active)}
                    onClick={closeMobileDrawer}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Nút mở/đóng panel — ghim ĐÁY rail, màu phân biệt trạng thái (desktop only) */}
      <div className="hidden shrink-0 justify-center border-t border-gray-100 px-2 py-3 md:flex dark:border-gray-800">
        <button
          type="button"
          onClick={toggleSubmenuPanel}
          aria-expanded={isSubmenuOpen}
          aria-label={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
          title={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
          className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
            isSubmenuOpen
              ? "bg-brand-500 shadow-theme-xs hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 text-white dark:text-white"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          }`}
        >
          {isSubmenuOpen ? (
            <AngleLeftIcon className="h-5 w-5" />
          ) : (
            <AngleRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ===== Desktop: rail + panel trong flow — panel mở thì PUSH nội dung ===== */}
      <div className="sticky top-0 hidden h-screen shrink-0 md:flex">
        <aside
          className={`flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.railWidth}`}
        >
          {railInner}
        </aside>

        <div
          className={`h-screen bg-white transition-[width] duration-300 ease-in-out dark:bg-gray-900 ${
            showPanel
              ? `${SIDEBAR_CLASSES.panelWidth} overflow-y-auto border-r border-gray-200 dark:border-gray-800`
              : "w-0 overflow-hidden"
          }`}
        >
          <div className={`px-4 py-5 ${SIDEBAR_CLASSES.panelWidth}`}>
            <h2 className="text-theme-sm font-semibold text-gray-800 dark:text-white/90">
              {panelSection?.name}
            </h2>
            <ul className="mt-3 flex flex-col gap-0.5">
              {panelSection?.items?.map((item) => {
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
      </div>

      {/* ===== Mobile: rail là drawer ===== */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.railWidth} md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {railInner}
      </aside>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default AppSidebar;
