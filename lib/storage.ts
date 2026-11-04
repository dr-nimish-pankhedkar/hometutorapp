import type { Attempt } from "./types";

const KEY = "ekagra:attempt";

export function saveAttempt(a: Attempt) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable (private mode) — report falls back to sample data */
  }
}

export function loadAttempt(): Attempt | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attempt) : null;
  } catch {
    return null;
  }
}
