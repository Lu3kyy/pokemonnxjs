export type NamedApiResource = { name: string; url: string };

export type PokemonData = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    versions?: {
      [generation: string]: {
        [version: string]: {
          front_default?: string | null;
        };
      };
    };
    other?: {
      [key: string]: {
        front_default?: string | null;
      };
    };
  };
  types: { slot: number; type: NamedApiResource }[];
  abilities: { ability: NamedApiResource }[];
  moves: { move: NamedApiResource }[];
  species: NamedApiResource;
};

export type PokemonSpeciesData = {
  evolution_chain: { url: string };
};

export type EvolutionNode = {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
};

export type EvolutionChainData = {
  chain: EvolutionNode;
};

export type EvolutionPath = {
  label: string;
  targetId: number;
};

export type EncounterLocation = {
  location_area: NamedApiResource;
};

export type FavoritePokemon = {
  id: number;
  name: string;
};

export type FallingPokemon = {
  id: number;
  sprite: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
};
