import BarChartOne from "@/features/charts/BarChartOne";
import ComponentCard from "@/components/shared/ComponentCard";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bar Chart | Hoàng Hà Digital",
  description: "Trang Bar Chart page forHoàng Hà Digital",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
