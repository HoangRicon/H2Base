"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import { navItems } from "@/components/layout/nav-items";

/**
 * Rail sidebar danh sách phẳng:
 * - Mỗi tile = icon + tên trang; BẤM LÀ SANG TRANG NGAY (không qua panel trung gian).
 * - Hover tile → tooltip chú thích tên trang bên phải rail.
 * - Quá nhiều icon: rail cuộn dọc với scrollbar mềm.
 * - Mobile (<768px): rail là drawer, mở bằng hamburger trên header.
 */
const AppSidebar: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const closeMobileDrawer = () => {
    if (window.innerWidth < 768 && isMobileOpen) toggleMobileSidebar();
  };

  const railInner = (
    <nav className="flex-1 overflow-x-clip overflow-y-auto px-2 pt-4 pb-3">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.path === pathname;
          return (
            <li key={`${item.name}-${item.path}`} className="group relative">
              <Link
                href={item.path}
                aria-label={item.name}
                onClick={closeMobileDrawer}
                className={`flex h-[72px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg px-1 transition-colors ${
                  active
                    ? "bg-brand-50 dark:bg-brand-500/[0.12]"
                    : "hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                <span
                  className={
                    active
                      ? "text-brand-500 dark:text-brand-400"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {item.icon}
                </span>
                <span
                  className={`text-center text-xs leading-tight ${
                    active
                      ? "text-brand-500 dark:text-brand-400 font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.name}
                </span>
              </Link>

              {/* Tooltip chú thích khi hover — desktop only, mép phải rail */}
              <span
                role="tooltip"
                className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 hidden translate-x-1 -translate-y-1/2 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100 md:block dark:bg-gray-700"
              >
                {item.name}
                <span className="absolute top-1/2 -left-1 -mt-1 h-2 w-2 rotate-45 rounded-[2px] bg-gray-900 dark:bg-gray-700" />
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ===== Desktop: rail trong flow ===== */}
      <aside
        className={`hidden h-full shrink-0 flex-col border-r border-gray-200 bg-white text-gray-900 md:flex dark:border-gray-800 dark:bg-gray-900 ${SIDEBAR_CLASSES.railWidth}`}
      >
        {railInner}
      </aside>

      {/* ===== Mobile: rail là drawer ===== */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-56 flex-col border-r border-gray-200 bg-white text-gray-900 transition-transform duration-300 ease-in-out md:hidden dark:border-gray-800 dark:bg-gray-900 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-hidden pt-4">{railInner}</div>
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
