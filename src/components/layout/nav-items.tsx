"use client";

import React from "react";
import {
  BoxCubeIcon,
  FileIcon,
  GridIcon,
  ListIcon,
  LockIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
  VideoIcon,
} from "@/icons";

export type SubMenuItem = { name: string; path: string; pro?: boolean; new?: boolean };

export type NavSection = {
  /** Tên nhóm — hiển thị dưới icon ở rail + làm chú thích khi hover. */
  name: string;
  icon: React.ReactNode;
  /** Trang chính của nhóm — BẤM icon là vào thẳng trang này. */
  path: string;
  /** Các trang con — hiển thị trong panel khi bấm nút mở rộng đáy rail. */
  items?: SubMenuItem[];
};

/**
 * Đăng ký navigation cho webapp quản lý.
 * - Bấm tile trên rail → sang thẳng `path` của nhóm.
 * - Nút mở rộng đáy rail → panel hiện các `items` để chọn trang chi tiết.
 * Thêm nghiệp vụ mới: thêm 1 entry + route tương ứng.
 */
export const navSections: NavSection[] = [
  {
    name: "General",
    icon: <GridIcon />,
    path: "/",
    items: [
      { name: "Ecommerce", path: "/", pro: false },
      { name: "Blank", path: "/blank", pro: false },
      { name: "Calendar", path: "/calendar", pro: false },
    ],
  },
  { name: "Users", icon: <UserCircleIcon />, path: "/profile" },
  {
    name: "Charts",
    icon: <PieChartIcon />,
    path: "/line-chart",
    items: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    name: "Ui Elements",
    icon: <BoxCubeIcon />,
    path: "/alerts",
    items: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatars", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Modals", path: "/modals", pro: false },
    ],
  },
  { name: "Forms", icon: <ListIcon />, path: "/form-elements" },
  { name: "Tables", icon: <TableIcon />, path: "/basic-tables" },
  { name: "Pages", icon: <PageIcon />, path: "/blank" },
  {
    name: "Auth",
    icon: <LockIcon />,
    path: "/signin",
    items: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
  { name: "Media", icon: <VideoIcon />, path: "/videos" },
  { name: "Blank", icon: <FileIcon />, path: "/blank" },
];
