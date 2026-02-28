import type { ForeignCurrency, Month } from "../tax/types";

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

// ─── Currency Prefs ───────────────────────────────────────────────────────────

const CURRENCY_KEY = "fisco-ng:currency-prefs";

export interface CurrencyPrefs {
  incomeCurrency: ForeignCurrency;
  exchangeRateToNgn: number;
}

export function loadCurrencyPrefs(): CurrencyPrefs | null {
  try {
    const raw = localStorage.getItem(CURRENCY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "incomeCurrency" in parsed &&
      "exchangeRateToNgn" in parsed
    ) {
      return parsed as CurrencyPrefs;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCurrencyPrefs(prefs: CurrencyPrefs): void {
  try {
    localStorage.setItem(CURRENCY_KEY, JSON.stringify(prefs));
  } catch {
    // silently fail
  }
}
