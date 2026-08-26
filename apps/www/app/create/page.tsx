import type { Metadata } from "next";
import { CreateStudio } from "../../components/create/create-studio";

export const metadata: Metadata = {
  title: "Create — Cronus UI",
  description: "Build, save, shuffle, and export complete Cronus UI design-system presets.",
};

export default function CreatePage() {
  return <CreateStudio />;
}
