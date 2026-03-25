import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import type { EvolutionPath, PokemonData } from "./types";
import { formatLabel } from "./utils";

type PokemonDetailsProps = {
  loading: boolean;
  pokemon: PokemonData | null;
  location: string;
  evolutionPaths: EvolutionPath[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectEvolution: (targetId: number) => void;
};

export function PokemonDetails({
  loading,
  pokemon,
  location,
  evolutionPaths,
  isFavorite,
  onToggleFavorite,
  onSelectEvolution,
}: PokemonDetailsProps) {
  return (
    <motion.section
      layout
      className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <AnimatePresence mode="wait">
        {loading || !pokemon ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center text-lg font-semibold text-slate-500"
          >
            Loading Pokemon...
          </motion.div>
        ) : (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.28em] text-rose-400 uppercase">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
                <h2 className="text-4xl font-bold text-slate-900">
                  {formatLabel(pokemon.name)}
                </h2>
              </div>
              <button
                onClick={onToggleFavorite}
                className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-[0_12px_32px_rgba(244,63,94,0.12)] transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                {isFavorite ? "★ Remove Favorite" : "☆ Add Favorite"}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-rose-100 bg-linear-to-br from-rose-50 to-white p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Default
                </p>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src={
                      pokemon.sprites.other?.["official-artwork"]
                        ?.front_default ||
                      pokemon.sprites.front_default ||
                      "/next.svg"
                    }
                    alt={`${pokemon.name} default`}
                    width={220}
                    height={220}
                    className="mx-auto"
                  />
                </motion.div>
              </div>
              <div className="rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-white p-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <p className="mb-2 text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Shiny
                </p>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: "easeInOut",
                    delay: 0.15,
                  }}
                >
                  <Image
                    src={
                      pokemon.sprites.front_shiny ||
                      pokemon.sprites.front_default ||
                      "/next.svg"
                    }
                    alt={`${pokemon.name} shiny`}
                    width={220}
                    height={220}
                    className="mx-auto"
                  />
                </motion.div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <h3 className="mb-3 text-lg font-bold text-slate-800">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map((entry) => (
                    <span
                      key={entry.type.name}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {formatLabel(entry.type.name)}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <h3 className="mb-3 text-lg font-bold text-slate-800">
                  Location
                </h3>
                <p className="text-sm font-medium text-slate-600">{location}</p>
              </article>
            </div>

            <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                Abilities
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((entry) => (
                  <span
                    key={entry.ability.name}
                    className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700"
                  >
                    {formatLabel(entry.ability.name)}
                  </span>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <h3 className="mb-3 text-lg font-bold text-slate-800">Moves</h3>
              <div className="max-h-52 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves.map((entry) => (
                    <span
                      key={entry.move.name}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {formatLabel(entry.move.name)}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                Evolutionary Paths
              </h3>
              {evolutionPaths.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {evolutionPaths.map((path) => (
                    <li key={`${path.label}-${path.targetId}`}>
                      <button
                        onClick={() => onSelectEvolution(path.targetId)}
                        className="text-left font-medium text-slate-700 transition hover:text-rose-600 hover:underline"
                      >
                        {path.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm">N/A</p>
              )}
            </article>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
