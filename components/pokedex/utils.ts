import type { EvolutionNode, EvolutionPath } from "./types";

export const MIN_DEX = 1;
export const MAX_DEX = 649;

export const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getPokemonIdFromSpeciesUrl = (url: string): number | null => {
  const match = url.match(/\/pokemon-species\/(\d+)\/?$/);
  if (!match) return null;
  return Number(match[1]);
};

const collectPathsFromNode = (
  node: EvolutionNode,
  ancestorLabels: string[],
  currentPokemonId: number,
): EvolutionPath[] => {
  const currentLabel = formatLabel(node.species.name);
  const currentPathLabels = [...ancestorLabels, currentLabel];

  return node.evolves_to.flatMap((child) => {
    const targetId = getPokemonIdFromSpeciesUrl(child.species.url);
    const childLabel = formatLabel(child.species.name);
    const directPath =
      targetId && targetId !== currentPokemonId
        ? [
            {
              label: [...currentPathLabels, childLabel].join(" → "),
              targetId,
            },
          ]
        : [];

    return [
      ...directPath,
      ...collectPathsFromNode(child, currentPathLabels, currentPokemonId),
    ];
  });
};

export const collectEvolutionPaths = (
  node: EvolutionNode,
  currentPokemonId: number,
): EvolutionPath[] => {
  const rootId = getPokemonIdFromSpeciesUrl(node.species.url);
  const basePath =
    rootId && rootId !== currentPokemonId
      ? [
          {
            label: formatLabel(node.species.name),
            targetId: rootId,
          },
        ]
      : [];

  return [...basePath, ...collectPathsFromNode(node, [], currentPokemonId)];
};
