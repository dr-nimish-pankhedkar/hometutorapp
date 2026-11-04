"use client";

import { useSyncExternalStore } from "react";
import { seedHistory } from "./sample";
import type { Attempt } from "./types";
import { student } from "./user";

/**
 * Demo persistence: the student's attempts live in this browser's localStorage.
 * There is no database — clearing site data (or "Reset demo data") starts fresh.
 */
const KEY = `tutoriq:attempts:${student.username}`;
const EVENT = "tutoriq:attempts-changed";

let cacheRaw: string | null | undefined;
let cache: Attempt[] = [];

function read(): Attempt[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
    if (raw === null) {
      raw = JSON.stringify(seedHistory(student.firstName));
      localStorage.setItem(KEY, raw);
    }
  } catch {
    raw = cacheRaw ?? JSON.stringify(seedHistory(student.firstName));
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = (JSON.parse(raw) as Attempt[]).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
    } catch {
      cache = [];
    }
  }
  return cache;
}

function write(list: Attempt[]) {
  const raw = JSON.stringify(list);
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    cacheRaw = raw; // storage blocked: keep it in memory for this page view
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const EMPTY: Attempt[] = [];

/** Newest first. `null` during server render / before hydration. */
export function useAttempts(): Attempt[] | null {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return hydrated ? list : null;
}

export function addAttempt(a: Attempt) {
  write([a, ...read()]);
}

export function resetAttempts() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    cacheRaw = undefined;
  }
  cacheRaw = undefined;
  window.dispatchEvent(new Event(EVENT));
}

export function newAttemptId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
