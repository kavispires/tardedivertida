import clsx from 'clsx';
// Components
import { ImageCardBack } from 'components';

type TableFaceDownProps = {
  players: GamePlayers;
  user: GamePlayer;
};

export function TableFaceDown({ players, user }: TableFaceDownProps) {
  const baseClass = 'c-table-face-down-card';

  return (
    <div className="c-table-face-down">
      {Object.values(players).map((player, index) => {
        const isHidden = !player.cardId;
        const hiddenClassModifier = player.id === user.id ? 'hidden-user' : 'hidden';

        return (
          <ImageCardBack
            key={`card-back-${player.id}`}
            cardWidth={150}
            className={clsx(
              baseClass,
              `${baseClass}--${index}`,
              isHidden && `${baseClass}--${hiddenClassModifier}`
            )}
          />
        );
      })}
    </div>
  );
}
