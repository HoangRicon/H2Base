"use client";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sidebar (rail + panel phụ) nằm TRONG FLOW cùng cột nội dung:
  // panel mở → width tăng trong flex → NỘI DUNG BỊ ĐẨY sang phải (không bị đè).
  // Header thuộc cột nội dung nên không bao giờ che sidebar.
  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <AppHeader />
        <div className="p-3 md:p-4">{children}</div>
      </div>
    </div>
  );
}
