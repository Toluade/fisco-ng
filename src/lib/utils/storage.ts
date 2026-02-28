import type { Month } from "../tax/types";

const STORAGE_KEY = "fisco-ng:ytd-incomes";

export type YtdStorage = Partial<Record<Month, number>>;

export function loadYtdIncomes(): YtdStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as YtdStorage;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveYtdIncomes(incomes: YtdStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incomes));
  } catch {
    // localStorage unavailable (private mode, quota exceeded, etc.) — silently fail
  }
}
