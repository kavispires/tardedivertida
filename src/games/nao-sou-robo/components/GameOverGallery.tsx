// Types
import type { GamePlayers } from 'types/player';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
import { ListOfPlayers } from 'components/players/ListOfPlayers';
// Internal
import type { RobotGalleryEntry } from '../utils/types';

type GameOverGalleryProps = {
  gallery: RobotGalleryEntry[];
  players: GamePlayers;
};

export function GameOverGallery({ gallery, players }: GameOverGalleryProps) {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Galeria de Captchas"
          en="Captcha Gallery"
        />
      }
    >
      {gallery.map((entry) => (
        <div
          key={entry.round}
          className="game-over-captcha"
        >
          <div className="game-over-captcha__squares">
            {entry.options.map((option) => (
              <ImageCard
                key={option.id}
                cardId={option.id}
                className="game-over-captcha__image"
                cardWidth={64}
                square
              />
            ))}
          </div>
          <div className="game-over-captcha__outcome">
            {entry.beaters.length > 0 ? (
              <ListOfPlayers
                players={players}
                list={entry.beaters}
                prefix={String(entry.round)}
                avatarsOnly
              />
            ) : (
              <IconAvatar icon={<RobotIcon />} />
            )}
          </div>
        </div>
      ))}
    </TitledContainer>
  );
}
