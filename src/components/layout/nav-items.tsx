"use client";

import React from "react";
import {
  BoxCubeIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  VideoIcon,
} from "@/icons";

export type SubMenuItem = { name: string; path: string; pro?: boolean; new?: boolean };

export type NavSection = {
  /** Nhãn hiển thị dưới icon ở rail hẹp. */
  name: string;
  icon: React.ReactNode;
  /**
   - `path`: section là 1 route đơn — click tile điều hướng thẳng.
   - `items`: section có menu con — click tile mở panel chi tiết cạnh rail.
   */
  path?: string;
  items?: SubMenuItem[];
  /** Nhóm hiển thị khi mở panel — nếu section có cả items. */
};

/**
 * Đăng ký navigation cho webapp quản lý.
 * Mỗi mục = 1 tile trên rail (icon + nhãn nhỏ).
 * Thêm nghiệp vụ mới: thêm 1 entry + route tương ứng.
 */
export const navSections: NavSection[] = [
  {
    name: "General",
    icon: <GridIcon />,
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
    items: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    name: "Ui Elements",
    icon: <BoxCubeIcon />,
    items: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatars", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
    ],
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    items: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    items: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    items: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
  {
    name: "Authentication",
    icon: <PlugInIcon />,
    items: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
  { name: "Media", icon: <VideoIcon />, path: "/videos" },
];
