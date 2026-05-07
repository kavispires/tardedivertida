import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';
import { useWindowSize } from 'react-use';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Internal
import { RoundType } from './RoundType';
import { SheepAvatar } from './SheepAvatar';

type PastureProps = {
  players: GamePlayers;
  pastureSize?: number;
  roundType?: number;
};

export function Pasture({ players, pastureSize = 5, roundType }: PastureProps) {
  const { width } = useWindowSize();
  const BASE_URL = useTDBaseUrl('assets');

  const { pastureWidth, pastureHeight, sheepWidth, gridStyleDistribution, sheepPerEnclosure } =
    useMemo(() => {
      const isShortPasture = pastureSize === 3;

      const pastureBase = Math.min(width, 1360) - 36;
      const pastureWidth = Math.max(pastureBase * (isShortPasture ? 0.65 : 1), 300);
      const pastureHeight = pastureWidth / (pastureSize === 5 ? 5 : 3.25);
      const sheepWidth = Math.min(width, 1360) / 22;
      const gridStyleDistribution = {
        gridTemplateColumns: isShortPasture ? '1fr 1fr 1fr 0.65fr' : '1fr 1fr 1fr 1fr 1fr 0.65fr',
      };

      const sheepPerEnclosure = Array(pastureSize + 1).fill(null);

      Object.values(players).forEach((player) => {
        if (sheepPerEnclosure[player.level] === null) {
          sheepPerEnclosure[player.level] = [];
        }
        sheepPerEnclosure[player.level].push(player);
      });

      return {
        pastureWidth,
        pastureHeight,
        sheepWidth,
        gridStyleDistribution,
        sheepPerEnclosure,
      };
    }, [players, pastureSize, width]);

  return (
    <div
      className="m-pasture-container"
      style={{ width: `${pastureWidth}px` }}
    >
      {roundType !== undefined && (
        <RoundType
          roundType={roundType}
          className="m-pasture-round-type"
        />
      )}

      <div
        className="m-pasture"
        style={{ height: `${pastureHeight}px` }}
      >
        <img
          src={`${BASE_URL}/game/m-pasture-${pastureSize}.jpg`}
          alt="pasture background"
          className="m-pasture__background"
        />

        <div
          className="m-enclosures"
          style={gridStyleDistribution}
        >
          <AnimatePresence mode="popLayout">
            {sheepPerEnclosure.map((sheepPlayers, enclosureId) => {
              const enclosureKey = `m-enclosure-${enclosureId}`;
              return (
                <div
                  className={clsx('m-enclosure', enclosureKey)}
                  key={enclosureKey}
                >
                  {sheepPlayers?.map((player: GamePlayer, index: number) => {
                    const sheepClassName = `m-sheep--pos-${index}`;

                    return (
                      <motion.div
                        key={player.id}
                        layout
                        transition={{
                          layout: { duration: 0.4, ease: 'easeInOut' },
                        }}
                      >
                        <SheepAvatar
                          id={player.avatarId}
                          sheepId={player.sheepId}
                          className={clsx(
                            'm-sheep',
                            sheepClassName,
                            player.animateRight && 'm-sheep--animate-right',
                            player.animateLeft && 'm-sheep--animate-left',
                            player.animateRebound && 'm-sheep--animate-rebound',
                            player.level === pastureSize && 'm-sheep--animate-die',
                          )}
                          width={sheepWidth}
                          animate
                        />
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="m-pasture-names">
          <div
            className="m-enclosures m-enclosures--names"
            style={gridStyleDistribution}
          >
            {sheepPerEnclosure.map((sheepPlayers, index) => {
              const names = sheepPlayers?.map((p: GamePlayer) => p.name)?.join(',\n') ?? '';

              return (
                <span
                  key={index}
                  className={clsx('m-enclosure-names', names && 'm-enclosure-names--has-names')}
                >
                  {names}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
