"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  /** Panel menu rộng cạnh rail (desktop) — toggle bằng nút mở rộng dưới đáy rail. */
  isSubmenuOpen: boolean;
  isMobileOpen: boolean;
  activeItem: string | null;
  toggleSubmenuPanel: () => void;
  openSubmenuPanel: () => void;
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
  const openSubmenuPanel = () => setIsSubmenuOpen(true);

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

  return (
    <SidebarContext.Provider
      value={{
        isSubmenuOpen,
        isMobileOpen,
        activeItem,
        toggleSubmenuPanel,
        openSubmenuPanel,
        toggleMobileSidebar,
        setActiveItem,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
