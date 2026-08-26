import type { Metadata } from "next";
import { CreateStudio } from "../../components/create/create-studio";

export const metadata: Metadata = {
  title: "Create — Kronus UI",
  description: "Build, save, shuffle, and export complete Kronus UI design-system presets.",
};

export default function CreatePage() {
  return <CreateStudio />;
}
