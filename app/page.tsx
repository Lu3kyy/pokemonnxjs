"use client";

import type { MouseEvent } from "react";

import { FavoritesPanel } from "@/components/pokedex/FavoritesPanel";
import { PokedexHeader } from "@/components/pokedex/PokedexHeader";
import { PokemonDetails } from "@/components/pokedex/PokemonDetails";
import { PokemonRainBackground } from "@/components/pokedex/PokemonRainBackground";
import { useFallingPokemon } from "@/hooks/useFallingPokemon";
import { useFavorites } from "@/hooks/useFavorites";
import { usePokemon } from "@/hooks/usePokemon";

export default function Home() {
  const {
    query, setQuery, loading, error,
    pokemon, location, evolutionPaths,
    fetchPokemon, getRandomPokemon,
  } = usePokemon();
  const { favorites, isFavorite, toggleFavorite } = useFavorites(pokemon);
  const fallingPokemon = useFallingPokemon();

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const bounds = currentTarget.getBoundingClientRect();
    currentTarget.style.setProperty("--pointer-x", `${(clientX - bounds.left) / bounds.width}`);
    currentTarget.style.setProperty("--pointer-y", `${(clientY - bounds.top) / bounds.height}`);
  };

  const handlePointerLeave = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", "0.5");
    event.currentTarget.style.setProperty("--pointer-y", "0.35");
  };

  return (
    <main
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fecaca_35%,#ffe4e6_68%,#fff7ed_100%)] px-4 py-8 text-slate-800"
      style={{
        ["--pointer-x" as string]: "0.5",
        ["--pointer-y" as string]: "0.35",
      }}
    >
      <PokemonRainBackground fallingPokemon={fallingPokemon} />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PokedexHeader
          query={query}
          onQueryChange={setQuery}
          onSearch={() => { void fetchPokemon(query); }}
          onRandom={getRandomPokemon}
        />

        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <PokemonDetails
            loading={loading}
            pokemon={pokemon}
            location={location}
            evolutionPaths={evolutionPaths}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelectEvolution={(targetId) => { void fetchPokemon(targetId); }}
          />
          <FavoritesPanel
            favorites={favorites}
            onSelect={(id) => { void fetchPokemon(id); }}
          />
        </div>
      </div>
    </main>
  );
}
