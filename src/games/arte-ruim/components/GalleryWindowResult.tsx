// Ant Design Resources
import { CrownFilled } from '@ant-design/icons';
import { Avatar as AntAvatar, Typography } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { getPlayersFromIds } from 'utils/helpers';
// Icons
import { GarbageIcon } from 'icons/GarbageIcon';
// Components
import { Avatar } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language';
import { StarPoints } from 'components/points';
// Internal
import type { PlayersSay } from '../utils/types';

type GalleryWindowResultProps = {
  playerArtist: GamePlayer;
  correctAnswerId: string;
  correctAnswerText: string;
  playersPoints?: NumberDictionary;
  playersSay: PlayersSay;
  players: GamePlayers;
};

export function GalleryWindowResult({
  playerArtist,
  correctAnswerId,
  correctAnswerText,
  playersPoints,
  playersSay,
  players,
}: GalleryWindowResultProps) {
  const correctGuesses = Object.values(playersSay?.[correctAnswerId] ?? {});

  return (
    <div className="a-gallery__result">
      <div className="a-gallery__label">
        <Translate pt="E o título correto da obra é" en="And the masterpiece title is" />
      </div>
      <div className="a-gallery__speech-bubble">
        <CrownFilled className="a-gallery__speech-bubble-icon" />
        {correctAnswerText}
      </div>
      {correctGuesses.length ? (
        <>
          <div className="a-gallery__players">
            <AntAvatar.Group>
              {correctGuesses.map((playerId) => {
                return <Avatar key={`correct-guess-avatar-${playerId}`} id={players[playerId].avatarId} />;
              })}
            </AntAvatar.Group>
            <StarPoints quantity={2} keyPrefix={`guessers-points-${playerArtist.id}`} />
            <span className="a-gallery__players-names">
              {getPlayersFromIds(correctGuesses, players, true).join(', ')}
            </span>
          </div>
          <div className="a-gallery__artist-points">
            <Avatar id={playerArtist.avatarId} />{' '}
            <StarPoints
              quantity={playersPoints?.[playerArtist.id]}
              keyPrefix={`artist-points-${playerArtist.id}`}
            />{' '}
            <span className="a-gallery__players-names">{playerArtist.name}</span>
          </div>
        </>
      ) : (
        <Typography.Text className="a-gallery__no-wins">
          <IconAvatar icon={<GarbageIcon />} size="large" shape="square" />
          <Translate
            pt="Nossa, ninguém acertou. Esse desenho deve ter sido muito ruim."
            en="Wow, nobody got it. It must have been a very crappy drawing. Shame..."
          />
        </Typography.Text>
      )}
    </div>
  );
}
