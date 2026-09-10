"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import Backdrop from "@/components/layout/Backdrop";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  // Nội dung chỉ chừa chỗ khi rail/pinel "ghim" (isExpanded).
  // - Rail hẹp luôn chiếm 64px từ breakpoint md.
  // - Pinned → panel 240px, nội dung chừa 240px.
  // - Hover mở rộng chỉ là overlay, KHÔNG đổi margin → không giật layout.
  const contentMargin = isExpanded
    ? SIDEBAR_CLASSES.contentPushExpanded
    : SIDEBAR_CLASSES.contentPushCollapsed;

  return (
    <div className="min-h-screen">
      <AppSidebar />
      <Backdrop />
      <div className={`flex-1 transition-[margin] duration-300 ease-in-out ${contentMargin}`}>
        <AppHeader />
        <div className="p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}
