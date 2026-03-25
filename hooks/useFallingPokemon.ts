"use client";

import { useEffect, useState } from "react";

import type { FallingPokemon } from "@/components/pokedex/types";
import {
  buildFallingPokemon,
  FALLING_POKEMON_REFRESH_MS,
} from "@/lib/fallingPokemon";

export function useFallingPokemon(): FallingPokemon[] {
  const [fallingPokemon, setFallingPokemon] = useState<FallingPokemon[]>([]);

  useEffect(() => {
    let cancelled = false;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = () => {
      refreshTimer = setTimeout(() => {
        void load();
      }, FALLING_POKEMON_REFRESH_MS);
    };

    const load = async () => {
      try {
        const results = await buildFallingPokemon(() => cancelled);
        if (!cancelled) {
          setFallingPokemon(results);
          scheduleRefresh();
        }
      } catch {
        if (!cancelled) {
          setFallingPokemon([]);
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

  return fallingPokemon;
}
