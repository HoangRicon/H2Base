"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  /** Panel menu con (cạnh rail) đang mở — PUSH nội dung sang phải, không đè. */
  isSubmenuOpen: boolean;
  isMobileOpen: boolean;
  /** Section user bấm gần nhất trên rail; null = derive theo route hiện tại. */
  selectedSection: number | null;
  activeItem: string | null;
  toggleSubmenuPanel: () => void;
  setSelectedSection: (index: number | null) => void;
  toggleMobileSidebar: () => void;
  setActiveItem: (item: string | null) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenuPanel = () => setIsSubmenuOpen((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isSubmenuOpen,
        isMobileOpen,
        selectedSection,
        activeItem,
        toggleSubmenuPanel,
        setSelectedSection,
        toggleMobileSidebar,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
