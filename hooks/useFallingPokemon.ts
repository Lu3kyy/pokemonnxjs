"use client";

import { useEffect, useRef, useState } from "react";

import type { FallingPokemon } from "@/components/pokedex/types";
import {
  buildBurstEntry,
  buildFallingPokemon,
  buildSpritePool,
  FALLING_POKEMON_REFRESH_MS,
  type SpritePoolEntry,
} from "@/lib/fallingPokemon";

const BURST_WINDOW_MS = 600;
const MAX_BURST = 20;

const computeBurstSize = (recentPresses: number) =>
  Math.min(recentPresses * recentPresses, MAX_BURST);

export function useFallingPokemon(): FallingPokemon[] {
  const [background, setBackground] = useState<FallingPokemon[]>([]);
  const [burst, setBurst] = useState<FallingPokemon[]>([]);
  const spritePoolRef = useRef<SpritePoolEntry[]>([]);
  const pressTimestampsRef = useRef<number[]>([]);
  const burstTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Background rain refresh loop
  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      refreshTimer = setTimeout(() => void load(), FALLING_POKEMON_REFRESH_MS);
    };

    const load = async () => {
      try {
        const results = await buildFallingPokemon(() => cancelled);
        if (!cancelled) {
          setBackground(results);
          scheduleRefresh();
        }
      } catch {
        if (!cancelled) {
          setBackground([]);
          scheduleRefresh();
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, []);

  // Build sprite pool for burst
  useEffect(() => {
    let cancelled = false;
    void buildSpritePool(() => cancelled).then((pool) => {
      if (!cancelled) spritePoolRef.current = pool;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Spacebar burst — rapid pressing multiplies the count quadratically
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      e.preventDefault();

      const now = Date.now();
      pressTimestampsRef.current = [
        ...pressTimestampsRef.current.filter((t) => now - t < BURST_WINDOW_MS),
        now,
      ];

      const pool = spritePoolRef.current;
      if (pool.length === 0) return;

      const burstSize = computeBurstSize(pressTimestampsRef.current.length);
      const newEntries: FallingPokemon[] = Array.from(
        { length: burstSize },
        () => {
          const pick = pool[Math.floor(Math.random() * pool.length)];
          return buildBurstEntry(pick.id, pick.sprite);
        },
      );

      setBurst((prev) => [...prev, ...newEntries]);

      // Remove each burst entry after its animation finishes
      newEntries.forEach((entry) => {
        if (!entry.uid) return;
        const durationMs = parseFloat(entry.duration) * 1000 + 500;
        const timer = setTimeout(() => {
          setBurst((prev) => prev.filter((e) => e.uid !== entry.uid));
          burstTimersRef.current.delete(entry.uid!);
        }, durationMs);
        burstTimersRef.current.set(entry.uid, timer);
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cleanup burst timers on unmount
  useEffect(() => {
    const timers = burstTimersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return [...background, ...burst];
}
