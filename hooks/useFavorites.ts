"use client";

import { useEffect, useMemo, useState } from "react";

import type { FavoritePokemon, PokemonData } from "@/components/pokedex/types";
import { MAX_DEX, MIN_DEX, formatLabel } from "@/components/pokedex/utils";

export function useFavorites(pokemon: PokemonData | null) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("poke-center-favorites");
    if (!saved) return;

    const parsed = JSON.parse(saved) as Array<number | FavoritePokemon>;
    const normalized = parsed
      .map((entry) => {
        if (typeof entry === "number") {
          return { id: entry, name: `Pokemon #${entry}` };
        }
        if (entry.id >= MIN_DEX && entry.id <= MAX_DEX) {
          return { id: entry.id, name: entry.name };
        }
        return null;
      })
      .filter((entry): entry is FavoritePokemon => entry !== null);

    setFavorites(normalized);
  }, []);

  useEffect(() => {
    localStorage.setItem("poke-center-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useMemo(
    () =>
      pokemon
        ? favorites.some((favorite) => favorite.id === pokemon.id)
        : false,
    [favorites, pokemon],
  );

  const toggleFavorite = () => {
    if (!pokemon) return;
    const entry: FavoritePokemon = {
      id: pokemon.id,
      name: formatLabel(pokemon.name),
    };
    setFavorites((prev) =>
      prev.some((f) => f.id === pokemon.id)
        ? prev.filter((f) => f.id !== pokemon.id)
        : [...prev, entry].sort((a, b) => a.id - b.id),
    );
  };

  return { favorites, isFavorite, toggleFavorite };
}
