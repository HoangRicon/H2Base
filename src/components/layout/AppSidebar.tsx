"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
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

      {/* Nhiều icon → cuộn với scrollbar mềm của hệ thống (tránh dùng no-scrollbar) */}
      <nav className="flex-1 overflow-x-hidden overflow-y-auto px-2 pb-3">
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

      {/* Nút mở/đóng panel — ghim ĐÁY rail, cùng kiểu nút cạnh ô tìm kiếm trong header
          (viền bo góc + icon hamburger / dấu đóng), màu phân biệt trạng thái (desktop only) */}
      <div className="hidden shrink-0 justify-center border-t border-gray-100 px-2 py-3 md:flex dark:border-gray-800">
        <button
          type="button"
          onClick={toggleSubmenuPanel}
          aria-expanded={isSubmenuOpen}
          aria-label={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
          title={isSubmenuOpen ? "Đóng menu" : "Mở menu"}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
            isSubmenuOpen
              ? "border-brand-500 bg-brand-50 text-brand-500 hover:bg-brand-100 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25"
              : "border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
          }`}
        >
          {isSubmenuOpen ? (
            // icon dấu đóng — như nút header khi drawer mở
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            // icon hamburger 3 gạch — như nút cạnh ô search trên header
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="currentColor"
              />
            </svg>
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
