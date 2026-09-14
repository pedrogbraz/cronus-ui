import { isThemeName, type Mode, type ThemeName } from "@cronus-ui/tokens";

export function parsePreset(value: string | undefined): ThemeName {
  return isThemeName(value) ? value : "aurora";
}

export function parseMode(value: string | undefined): Mode {
  return value === "light" || value === "dark" ? value : "dark";
}

export function parseDir(value: string | undefined): "ltr" | "rtl" {
  return value === "rtl" ? "rtl" : "ltr";
}
