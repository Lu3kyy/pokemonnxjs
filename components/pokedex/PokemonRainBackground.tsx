import Image from "next/image";

import type { FallingPokemon } from "./types";

type PokemonRainBackgroundProps = {
  fallingPokemon: FallingPokemon[];
};

export function PokemonRainBackground({
  fallingPokemon,
}: PokemonRainBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pokebg-grid absolute inset-0 opacity-40" />
      <div className="pokebg-rain-layer absolute inset-0">
        {fallingPokemon.map((entry, index) => (
          <Image
            key={entry.uid ?? `${entry.id}-${index}`}
            src={entry.sprite}
            alt=""
            aria-hidden="true"
            className="pokebg-rain"
            unoptimized
            sizes="120px"
            style={{
              left: entry.left,
              width: entry.size,
              height: entry.size,
              opacity: entry.opacity,
              animationDuration: entry.duration,
              animationDelay: entry.delay,
              // Burst entries fall once then disappear; background entries loop
              ...(entry.uid
                ? {
                    animationIterationCount: "1",
                    animationFillMode: "forwards",
                  }
                : {}),
            }}
            width={128}
            height={128}
          />
        ))}
      </div>
      <div className="pokebg-ball pokebg-ball-one" />
      <div className="pokebg-ball pokebg-ball-two" />
      <div className="pokebg-ball pokebg-ball-three" />
    </div>
  );
}
