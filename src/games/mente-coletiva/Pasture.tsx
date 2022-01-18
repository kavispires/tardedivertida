import { useMemo } from 'react';
import clsx from 'clsx';
// Hooks
import { useDimensions } from '../../hooks';
// Images
import pastureBackground from '../../images/m-pasture-background.png';
import pastureFence from '../../images/m-pasture-fence.svg';
// Components
import { SheepAvatar } from '../../components/avatars';

type PastureProps = {
  players: GamePlayers;
};

export function Pasture({ players }: PastureProps) {
  const [width] = useDimensions();

  const pastureWidth = Math.min(width, 1360) - 36;
  const pastureHeight = pastureWidth / 4;
  const sheepWidth = Math.min(width, 1360) / 22;

  const sheepPerEnclosure = useMemo(() => {
    const spe = Array(6).fill(null);
    Object.values(players).forEach((player) => {
      if (spe[player.level] === null) {
        spe[player.level] = [];
      }
      spe[player.level].push(player);
    });

    return spe;
  }, [players]);

  return (
    <>
      <div className="m-pasture" style={{ width: `${pastureWidth}px`, height: `${pastureHeight}px` }}>
        <img src={pastureBackground} alt="pasture background" className="m-pasture__background" />

        <div className="m-enclosures">
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
                        className={clsx(
                          'm-sheep',
                          sheepClassName,
                          player.animateRight && 'm-sheep--animate-right',
                          player.animateLeft && 'm-sheep--animate-left',
                          player.animateRebound && 'm-sheep--animate-rebound',
                          player.level === 5 && 'm-sheep--animate-die'
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

        <img src={pastureFence} alt="fence" className="m-pasture__fence" />
      </div>
      <div className="m-pasture-names" style={{ width: `${Math.min(pastureWidth, 1360)}px` }}>
        <div className="m-enclosures m-enclosures--names">
          {sheepPerEnclosure.map((sheepPlayers, index) => {
            const names = sheepPlayers?.map((p: GamePlayer) => p.name)?.join(',\n') ?? '';
            return (
              <span key={`m-enclosure-${index}`} className="m-enclosure-names">
                {names}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
