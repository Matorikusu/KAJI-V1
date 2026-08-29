export type Platform = "windows" | "macos" | "linux";

export type Platforms = Record<Platform, boolean>;

export type HistoryItem = {
  id: string;
  name: string;
  framework: string;
  at: number;
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

export const PLATFORM_ARTIFACT: Record<Platform, string> = {
  windows: ".exe",
  macos: ".app",
  linux: "",
};
