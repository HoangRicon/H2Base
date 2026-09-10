"use client";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { SIDEBAR_CLASSES } from "@/lib/constants";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Nội dung chỉ chừa đúng chiều rộng rail (w-20) từ breakpoint md.
  // Panel menu con là overlay cạnh rail — không push layout → không giật.
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className={`flex-1 ${SIDEBAR_CLASSES.contentPush}`}>
        <AppHeader />
        <div className="p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}
