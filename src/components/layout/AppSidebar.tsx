"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import { navSections, type NavSection } from "@/components/layout/nav-items";

type TooltipState = { name: string; x: number; y: number } | null;

/**
 * Rail sidebar + panel mở rộng:
 * - Rail (w-22): mỗi nhóm là 1 tile icon + nhãn; BẤM TILE → VÀO THẲNG trang chính của nhóm.
 * - Hover tile → tooltip chú thích NỔI LÊN ngoài mép rail (không bị che).
 * - Rail KHÔNG hiện thanh trượt (ẩn scrollbar, vẫn cuộn được).
 * - Nút mở rộng ở CUỐI rail (ghim đáy, không cuộn theo icon) → panel trang con
 *   hiện cạnh rail, PUSH nội dung (không đè).
 * - Mobile: drawer + hamburger header.
 */
const AppSidebar: React.FC = () => {
  const {
    isMobileOpen,
    isSubmenuOpen,
    selectedSection,
    toggleSubmenuPanel,
    setSelectedSection,
    toggleMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();

  const isSectionActive = (section: NavSection) =>
    section.path === pathname || (section.items?.some((item) => item.path === pathname) ?? false);

  // Section hiển thị trong panel: user bấm gần nhất, ngược lại theo route hiện tại.
  const routeIdx = navSections.findIndex((s) => isSectionActive(s));
  const panelIndex = selectedSection ?? (routeIdx >= 0 ? routeIdx : 0);
  const panelSection = navSections[panelIndex];

  const closeMobileDrawer = () => {
    if (window.innerWidth < 768 && isMobileOpen) toggleMobileSidebar();
  };

  // Tooltip FIXED duy nhất (không nằm trong nav có overflow → không bị che).
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const showTooltip = (e: React.MouseEvent | React.FocusEvent, name: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ name, x: rect.right + 10, y: rect.top + rect.height / 2 });
  };

  const tileClass = (active: boolean) =>
    `flex h-[72px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-1 transition-colors ${
      active ? "bg-brand-50 dark:bg-brand-500/[0.12]" : "hover:bg-gray-100 dark:hover:bg-white/5"
    }`;

  const railInner = (
    <>
      {/* no-scrollbar: ẩn thanh trượt khi nhiều icon, vẫn cuộn bằng wheel/trackpad */}
      <nav className="no-scrollbar flex-1 overflow-x-clip overflow-y-auto px-2 pt-4 pb-3">
        <ul className="flex flex-col gap-1">
          {navSections.map((section, index) => {
            const active = isSectionActive(section);
            return (
              <li key={section.name} className="group relative">
                <Link
                  href={section.path}
                  aria-label={section.name}
                  onClick={() => {
                    // Bấm icon: vào thẳng trang chính + panel (nếu đang mở) đổi sang nhóm này
                    setSelectedSection(index);
                    closeMobileDrawer();
                  }}
                  onMouseEnter={(e) => showTooltip(e, section.name)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={(e) => showTooltip(e, section.name)}
                  onBlur={() => setTooltip(null)}
                  className={tileClass(active)}
                >
                  <span
                    className={
                      active
                        ? "text-brand-500 dark:text-brand-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  >
                    {section.icon}
                  </span>
                  <span
                    className={`text-center text-xs leading-tight ${
                      active
                        ? "text-brand-500 dark:text-brand-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {section.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Nút mở rộng — LUÔN ở CUỐI rail (ghim đáy, không cuộn theo icon).
          Icon hamburger giữ nguyên; khi mở: nền brand + bóng đổ. */}
      <div className="hidden shrink-0 justify-center border-t border-gray-100 px-2 py-3 md:flex dark:border-gray-800">
        <button
          type="button"
          onClick={toggleSubmenuPanel}
          aria-expanded={isSubmenuOpen}
          aria-label={isSubmenuOpen ? "Đóng panel" : "Mở panel"}
          title={isSubmenuOpen ? "Đóng panel" : "Mở panel"}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 ${
            isSubmenuOpen
              ? "bg-brand-500 shadow-brand-500/40 dark:bg-brand-500 text-white shadow-lg dark:text-white"
              : "text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-gray-200"
          }`}
        >
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
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Tooltip FIXED — render ở gốc component, nổi trên mọi layer, không bị rail/nội dung che */}
      {tooltip && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-[100] hidden -translate-y-1/2 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg md:block dark:bg-gray-700"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.name}
          <span className="absolute top-1/2 -left-1 -mt-1 h-2 w-2 rotate-45 rounded-[2px] bg-gray-900 dark:bg-gray-700" />
        </span>
      )}

      {/* ===== Desktop: rail + panel trang con trong flow (PUSH nội dung) ===== */}
      <div className="hidden shrink-0 self-stretch md:flex">
        <aside
          className={`flex h-full flex-col border-r border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.railWidth}`}
        >
          {railInner}
        </aside>

        {/* Panel: CHỈ hiện các trang con của section đang chọn trên rail
            (vd bấm Báo cáo → chỉ nhóm báo cáo, không lai các nhóm khác) */}
        <div
          className={`h-full bg-white transition-[width] duration-300 ease-in-out dark:bg-gray-900 ${
            isSubmenuOpen
              ? `${SIDEBAR_CLASSES.panelWidth} overflow-y-auto border-r border-gray-200 dark:border-gray-800`
              : "w-0 overflow-hidden"
          }`}
        >
          <div className={`px-3 py-4 ${SIDEBAR_CLASSES.panelWidth}`}>
            <h2 className="mb-2 px-2 text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300">
              {panelSection?.name}
            </h2>
            {panelSection?.items?.length ? (
              <ul className="flex flex-col gap-0.5">
                {panelSection.items.map((item) => {
                  const active = item.path === pathname;
                  return (
                    <li key={`${panelSection.name}-${item.name}`}>
                      <Link
                        href={item.path}
                        className={`menu-dropdown-item ${
                          active ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {item.name}
                        {item.new && (
                          <span className="menu-dropdown-badge menu-dropdown-badge-active ml-auto">
                            new
                          </span>
                        )}
                        {item.pro && (
                          <span className="menu-dropdown-badge menu-dropdown-badge-inactive ml-auto">
                            pro
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-2 text-sm text-gray-400 dark:text-gray-500">
                Mục này không có trang con.
              </p>
            )}
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
