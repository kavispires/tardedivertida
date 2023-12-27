import { useMemo } from 'react';
import clsx from 'clsx';
import { useWindowSize } from 'react-use';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { RoundType } from './RoundType';
import { SheepAvatar } from './SheepAvatar';

type PastureProps = {
  players: GamePlayers;
  pastureSize?: number;
  roundType?: number;
};

export function Pasture({ players, pastureSize = 5, roundType }: PastureProps) {
  const { width } = useWindowSize();
  const isShortPasture = pastureSize === 3;

  const pastureBase = Math.min(width, 1360) - 36;
  const pastureWidth = Math.max(pastureBase * (isShortPasture ? 0.65 : 1), 300);
  const pastureHeight = pastureBase / 4;
  const sheepWidth = Math.min(width, 1360) / 22;
  const gridStyleDistribution = {
    gridTemplateColumns: isShortPasture ? '1fr 1fr 1fr 0.65fr' : '1fr 1fr 1fr 1fr 1fr 0.65fr',
  };

  const sheepPerEnclosure = useMemo(() => {
    const spe = Array(pastureSize + 1).fill(null);
    Object.values(players).forEach((player) => {
      if (spe[player.level] === null) {
        spe[player.level] = [];
      }
      spe[player.level].push(player);
    });

    return spe;
  }, [players, pastureSize]);

  return (
    <div className="m-pasture-container" style={{ width: `${pastureWidth}px` }}>
      {roundType !== undefined && <RoundType roundType={roundType} className="m-pasture-round-type" />}

      <div className="m-pasture" style={{ height: `${pastureHeight}px` }}>
        <img
          src={`${PUBLIC_URL.IN_GAME}m-pasture-${pastureSize}.png`}
          alt="pasture background"
          className="m-pasture__background"
        />

        <div className="m-enclosures" style={gridStyleDistribution}>
          {sheepPerEnclosure.map((sheepPlayers, enclosureId) => {
            const enclosureKey = `m-enclosure-${enclosureId}`;
            return (
              <div className={clsx('m-enclosure', enclosureKey)} key={enclosureKey}>
                {sheepPlayers &&
                  sheepPlayers.map((player: GamePlayer, index: number) => {
                    const sheepKey = `${enclosureKey}-${player.id}`;
                    const sheepClassName = `m-sheep--pos-${index}`;

                    return (
                      <SheepAvatar
                        key={sheepKey}
                        id={player.avatarId}
                        sheepId={player.sheepId}
                        className={clsx(
                          'm-sheep',
                          sheepClassName,
                          player.animateRight && 'm-sheep--animate-right',
                          player.animateLeft && 'm-sheep--animate-left',
                          player.animateRebound && 'm-sheep--animate-rebound',
                          player.level === pastureSize && 'm-sheep--animate-die'
                        )}
                        width={sheepWidth}
                        animate
                      />
                    );
                  })}
              </div>
            );
          })}
        </div>

        <img
          src={`${PUBLIC_URL.IN_GAME}m-fence-${pastureSize}.svg`}
          alt="fence"
          className="m-pasture__fence"
        />
        <div className="m-pasture-names">
          <div className="m-enclosures m-enclosures--names" style={gridStyleDistribution}>
            {sheepPerEnclosure.map((sheepPlayers, index) => {
              const names = sheepPlayers?.map((p: GamePlayer) => p.name)?.join(',\n') ?? '';
              return (
                <span
                  key={`m-enclosure-${index}`}
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
