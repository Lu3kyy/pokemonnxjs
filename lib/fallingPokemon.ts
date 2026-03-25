import type { FallingPokemon, PokemonData } from "@/components/pokedex/types";
import { MAX_DEX, MIN_DEX } from "@/components/pokedex/utils";

export const FALLING_POKEMON_COUNT = 12;
export const FALLING_POKEMON_REFRESH_MS = 5000;
export const SPRITE_POOL_SIZE = 200;
const POOL_BATCH_SIZE = 20;

export type SpritePoolEntry = { id: number; sprite: string };

export const shufflePokemonIds = (): number[] => {
  const ids = Array.from(
    { length: MAX_DEX - MIN_DEX + 1 },
    (_, index) => index + MIN_DEX,
  );

  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = ids[index];
    ids[index] = ids[swapIndex];
    ids[swapIndex] = current;
  }

  return ids;
};

const getSpriteUrl = (pokemon: PokemonData): string | null =>
  pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.front_default ??
  pokemon.sprites.versions?.["generation-iv"]?.platinum?.front_default ??
  pokemon.sprites.front_default;

export const buildFallingPokemon = async (
  cancelled: () => boolean,
): Promise<FallingPokemon[]> => {
  const ids = shufflePokemonIds();
  const results: FallingPokemon[] = [];

  for (const id of ids) {
    if (results.length >= FALLING_POKEMON_COUNT || cancelled()) break;

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) continue;

    const data = (await response.json()) as PokemonData;
    const sprite = getSpriteUrl(data);
    if (!sprite) continue;

    results.push({
      id: data.id,
      sprite,
      left: `${Math.random() * 92}%`,
      size: `${72 + Math.random() * 56}px`,
      duration: `${18 + Math.random() * 14}s`,
      delay: `${Math.random() * -6}s`,
      opacity: Number((0.22 + Math.random() * 0.28).toFixed(2)),
    });
  }

  return results;
};

const fetchSpriteEntry = async (
  id: number,
): Promise<SpritePoolEntry | null> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) return null;
    const data = (await response.json()) as PokemonData;
    const sprite = getSpriteUrl(data);
    return sprite ? { id: data.id, sprite } : null;
  } catch {
    return null;
  }
};

export const buildSpritePool = async (
  cancelled: () => boolean,
): Promise<SpritePoolEntry[]> => {
  const ids = shufflePokemonIds().slice(0, Math.ceil(SPRITE_POOL_SIZE * 1.4)); // extra to cover misses
  const results: SpritePoolEntry[] = [];

  for (
    let i = 0;
    i < ids.length && results.length < SPRITE_POOL_SIZE && !cancelled();
    i += POOL_BATCH_SIZE
  ) {
    const batch = ids.slice(i, i + POOL_BATCH_SIZE);
    const settled = await Promise.allSettled(batch.map(fetchSpriteEntry));

    for (const outcome of settled) {
      if (cancelled()) break;
      if (outcome.status === "fulfilled" && outcome.value) {
        results.push(outcome.value);
      }
    }
  }

  return results;
};

export const buildBurstEntry = (
  id: number,
  sprite: string,
): FallingPokemon => ({
  id,
  sprite,
  uid: `burst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  left: `${Math.random() * 92}%`,
  size: `${64 + Math.random() * 64}px`,
  duration: `${3 + Math.random() * 3}s`,
  delay: "0s",
  opacity: Number((0.55 + Math.random() * 0.35).toFixed(2)),
});
