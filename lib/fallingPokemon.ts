import type { FallingPokemon, PokemonData } from "@/components/pokedex/types";
import { MAX_DEX, MIN_DEX } from "@/components/pokedex/utils";

export const FALLING_POKEMON_COUNT = 12;
export const FALLING_POKEMON_REFRESH_MS = 5000;

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
