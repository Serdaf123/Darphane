"use client";

import { useSyncExternalStore } from "react";

/**
 * Saniyede bir tiklayan paylaşımlı saat.
 * Sunucuda ve hidrasyon sırasında null döner; böylece statik HTML ile
 * istemci ilk render'ı birebir aynı olur, mismatch çıkmaz.
 */

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    timer = setInterval(() => listeners.forEach((fn) => fn()), 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

// Aynı saniye içinde aynı değer: React snapshot'ın kararlı olmasını ister.
function getSnapshot() {
  return Math.floor(Date.now() / 1000) * 1000;
}

function getServerSnapshot(): number | null {
  return null;
}

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
