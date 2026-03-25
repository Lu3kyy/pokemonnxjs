import { motion } from "framer-motion";

type PokedexHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onRandom: () => void;
};

export function PokedexHeader({
  query,
  onQueryChange,
  onSearch,
  onRandom,
}: PokedexHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-4xl border border-white/70 bg-white/78 p-6 shadow-[0_24px_80px_rgba(190,24,93,0.14)] backdrop-blur-xl"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.34em] text-rose-400 uppercase">
            Kanto to Unova Index
          </p>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Pokedex
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Generation 1-5 Pokemon Companion
          </p>
        </div>

        <form
          className="flex w-full flex-col gap-3 sm:flex-row md:max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search name or Pokedex #"
            className="w-full rounded-2xl border border-rose-100 bg-white/90 px-4 py-3 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
          />
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-[0_16px_32px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onRandom}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"
          >
            Random
          </button>
        </form>
      </div>
    </motion.header>
  );
}
