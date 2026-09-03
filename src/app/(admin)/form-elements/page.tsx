import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import CheckboxComponents from "@/features/forms/CheckboxComponents";
import DefaultInputs from "@/features/forms/DefaultInputs";
import DropzoneComponent from "@/features/forms/DropZone";
import FileInputExample from "@/features/forms/FileInputExample";
import InputGroup from "@/features/forms/InputGroup";
import InputStates from "@/features/forms/InputStates";
import RadioButtons from "@/features/forms/RadioButtons";
import SelectInputs from "@/features/forms/SelectInputs";
import TextAreaInput from "@/features/forms/TextAreaInput";
import ToggleSwitch from "@/features/forms/ToggleSwitch";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
