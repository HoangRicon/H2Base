"use client";

import React from "react";
import {
  AlertIcon,
  BoxCubeIcon,
  BoxIcon,
  CalenderIcon,
  CheckCircleIcon,
  DocsIcon,
  FileIcon,
  GridIcon,
  ListIcon,
  LockIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  VideoIcon,
} from "@/icons";

export type NavItem = {
  /** Tên trang — hiển thị dưới icon và làm chú thích (tooltip) khi hover. */
  name: string;
  icon: React.ReactNode;
  /** Bấm icon → điều hướng thẳng tới trang này. */
  path: string;
};

/**
 * Đăng ký navigation cho webapp quản lý (danh sách phẳng).
 * Mỗi mục = 1 tile trên rail: icon + nhãn, hover có tooltip, bấm vào là sang trang luôn.
 * Thêm nghiệp vụ mới: thêm 1 entry + route tương ứng.
 */
export const navItems: NavItem[] = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  { name: "Calendar", icon: <CalenderIcon />, path: "/calendar" },
  { name: "User Profile", icon: <UserCircleIcon />, path: "/profile" },
  { name: "Line Chart", icon: <PieChartIcon />, path: "/line-chart" },
  { name: "Bar Chart", icon: <BoxCubeIcon />, path: "/bar-chart" },
  { name: "Form Elements", icon: <ListIcon />, path: "/form-elements" },
  { name: "Basic Tables", icon: <TableIcon />, path: "/basic-tables" },
  { name: "Alerts", icon: <AlertIcon />, path: "/alerts" },
  { name: "Avatars", icon: <BoxIcon />, path: "/avatars" },
  { name: "Badge", icon: <DocsIcon />, path: "/badge" },
  { name: "Buttons", icon: <CheckCircleIcon />, path: "/buttons" },
  { name: "Images", icon: <FileIcon />, path: "/images" },
  { name: "Videos", icon: <VideoIcon />, path: "/videos" },
  { name: "Modals", icon: <PageIcon />, path: "/modals" },
  { name: "Blank Page", icon: <FileIcon />, path: "/blank" },
  { name: "404 Error", icon: <AlertIcon />, path: "/error-404" },
  { name: "Sign In", icon: <LockIcon />, path: "/signin" },
  { name: "Sign Up", icon: <PlugInIcon />, path: "/signup" },
];
