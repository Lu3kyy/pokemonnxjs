"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { FallingPokemon } from "@/components/pokedex/types";
import {
  buildBurstEntry,
  buildFallingPokemon,
  buildSpritePool,
  type SpritePoolEntry,
} from "@/lib/fallingPokemon";

const BURST_WINDOW_MS = 150;
const BURST_COOLDOWN_MS = 100;
const MAX_BURST = 20;

const computeBurstSize = (recentPresses: number) =>
  Math.min(recentPresses * recentPresses, MAX_BURST);

export function useFallingPokemon(): {
  fallingPokemon: FallingPokemon[];
  rotatePokemon: (index: number) => void;
} {
  const [background, setBackground] = useState<FallingPokemon[]>([]);
  const [burst, setBurst] = useState<FallingPokemon[]>([]);
  const spritePoolRef = useRef<SpritePoolEntry[]>([]);
  const pressTimestampsRef = useRef<number[]>([]);
  const lastBurstAtRef = useRef<number>(0);
  const burstTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Load initial background set once — sprites loop infinitely and rotate on iteration
  useEffect(() => {
    let cancelled = false;
    void buildFallingPokemon(() => cancelled).then((results) => {
      if (!cancelled) setBackground(results);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Swap one background sprite when its animation loops back to the top (off-screen)
  const rotatePokemon = useCallback((index: number) => {
    const pool = spritePoolRef.current;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setBackground((prev) => {
      if (index >= prev.length) return prev;
      const next = [...prev];
      next[index] = { ...next[index], id: pick.id, sprite: pick.sprite };
      return next;
    });
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

      if (now - lastBurstAtRef.current < BURST_COOLDOWN_MS) return;

      pressTimestampsRef.current = [
        ...pressTimestampsRef.current.filter((t) => now - t < BURST_WINDOW_MS),
        now,
      ];

      const pool = spritePoolRef.current;
      if (pool.length === 0) return;

      const burstSize = computeBurstSize(pressTimestampsRef.current.length);
      lastBurstAtRef.current = now;
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

  return { fallingPokemon: [...background, ...burst], rotatePokemon };
}
