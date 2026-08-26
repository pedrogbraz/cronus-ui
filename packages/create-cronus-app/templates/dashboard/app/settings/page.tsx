import type { Metadata } from "next";
import { SettingsForm } from "../../components/settings-form";

export const metadata: Metadata = {
  title: "Settings — __APP_NAME__",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-fg">Settings</h1>
        <p className="text-sm text-fg-secondary">
          Manage your profile, workspace preferences, and notifications.
        </p>
      </header>

      <SettingsForm />
    </div>
  );
}
