"use client";

import { useEffect, useState } from "react";

import type {
  EncounterLocation,
  EvolutionChainData,
  EvolutionPath,
  PokemonData,
  PokemonSpeciesData,
} from "@/components/pokedex/types";
import {
  MAX_DEX,
  MIN_DEX,
  collectEvolutionPaths,
  formatLabel,
} from "@/components/pokedex/utils";

export function usePokemon() {
  const [query, setQuery] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [location, setLocation] = useState("N/A");
  const [evolutionPaths, setEvolutionPaths] = useState<EvolutionPath[]>([]);

  const fetchPokemon = async (value: string | number) => {
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return;

    if (/^\d+$/.test(normalized)) {
      const id = Number(normalized);
      if (id < MIN_DEX || id > MAX_DEX) {
        setError("Only Generation 1–5 Pokémon are available (1-649).");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const pokemonRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${normalized}`,
      );
      if (!pokemonRes.ok) throw new Error("Pokémon not found");
      const pokemonData = (await pokemonRes.json()) as PokemonData;

      if (pokemonData.id < MIN_DEX || pokemonData.id > MAX_DEX) {
        throw new Error("Only Generation 1–5 Pokémon are available (1-649).");
      }

      const [locationRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.id}/encounters`),
        fetch(pokemonData.species.url),
      ]);

      const locationData = locationRes.ok
        ? ((await locationRes.json()) as EncounterLocation[])
        : [];
      const oneLocation =
        locationData.length > 0
          ? formatLabel(locationData[0].location_area.name)
          : "N/A";

      let evolutions: string[] = [];
      if (speciesRes.ok) {
        const speciesData = (await speciesRes.json()) as PokemonSpeciesData;
        const chainRes = await fetch(speciesData.evolution_chain.url);
        if (chainRes.ok) {
          const chainData = (await chainRes.json()) as EvolutionChainData;
          evolutions = collectEvolutionPaths(chainData.chain, pokemonData.id);
        }
      }

      setPokemon(pokemonData);
      setLocation(oneLocation);
      setEvolutionPaths(evolutions);
      setQuery(String(pokemonData.id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setPokemon(null);
      setLocation("N/A");
      setEvolutionPaths([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial Pokemon
  useEffect(() => {
    void fetchPokemon(1);
  }, []);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const parsedQuery = Number(query);
      const currentId =
        pokemon?.id ?? (Number.isNaN(parsedQuery) ? MIN_DEX : parsedQuery);

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const nextId = Math.max(MIN_DEX, currentId - 1);
        if (nextId !== currentId) void fetchPokemon(nextId);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextId = Math.min(MAX_DEX, currentId + 1);
        if (nextId !== currentId) void fetchPokemon(nextId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pokemon, query]);

  const getRandomPokemon = () => {
    const randomId =
      Math.floor(Math.random() * (MAX_DEX - MIN_DEX + 1)) + MIN_DEX;
    void fetchPokemon(randomId);
  };

  return {
    query,
    setQuery,
    loading,
    error,
    pokemon,
    location,
    evolutionPaths,
    fetchPokemon,
    getRandomPokemon,
  };
}
