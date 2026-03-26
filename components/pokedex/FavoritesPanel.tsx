import { motion } from "framer-motion";

type FavoritePokemon = {
  id: number;
  name: string;
};

type FavoritesPanelProps = {
  favorites: FavoritePokemon[];
  onSelect: (id: number) => void;
};

export function FavoritesPanel({ favorites, onSelect }: FavoritesPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-4xl border border-white/70 bg-white/78 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Favorites</h3>
        <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-rose-500 uppercase">
          {favorites.length} saved
        </span>
      </div>
      {favorites.length === 0 ? (
        <p className="text-sm font-medium text-slate-500">No favorites yet.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((favorite) => (
            <li key={favorite.id}>
              <button
                onClick={() => onSelect(favorite.id)}
                className="w-full rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-left shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/70"
              >
                <span className="block text-sm font-semibold text-slate-900">
                  {favorite.name}
                </span>
                <span className="mt-1 block text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
                  #{favorite.id.toString().padStart(3, "0")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-5 text-xs font-medium tracking-[0.16em] text-slate-400 uppercase">
        Tip: Search by exact Pokemon name or Pokedex number. Spacebar to make Pokémon rain, and arrow keys to navigate!
      </p>
    </motion.aside>
  );
}
