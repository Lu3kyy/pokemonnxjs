import Image from "next/image";

import type { FallingPokemon } from "./types";

type PokemonRainBackgroundProps = {
  fallingPokemon: FallingPokemon[];
  onRotate: (index: number) => void;
};

export function PokemonRainBackground({
  fallingPokemon,
  onRotate,
}: PokemonRainBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="pokebg-grid absolute inset-0 opacity-40" />
      <div className="pokebg-hint" aria-hidden="true">
        Hold Space
      </div>
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
              // Burst entries play once and clean up; background entries loop forever
              ...(entry.uid
                ? {
                    animationIterationCount: "1",
                    animationFillMode: "forwards",
                  }
                : {}),
            }}
            // Swap sprite only when it loops back off-screen at the top
            {...(!entry.uid
              ? { onAnimationIteration: () => onRotate(index) }
              : {})}
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
