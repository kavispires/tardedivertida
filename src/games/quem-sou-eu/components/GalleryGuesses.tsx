import { orderBy } from 'lodash';
// Ant Design Resources
import { CrownFilled, MessageFilled } from '@ant-design/icons';
import { Avatar as AntAvatar, Space, Typography } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Utils
import { getPlayerNamesFromIds } from 'utils/helpers';
// Icons
import { GarbageIcon } from 'icons/GarbageIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { StarPoints } from 'components/points';
// Internal
import type { Characters } from '../utils/types';

type GalleryGuessesProps = {
  players: GamePlayers;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: NumberDictionary;
  characters: Characters;
  currentColor: string;
  currentPlayer: GamePlayer;
  round: GameRound;
  imageCardMode: boolean;
};

export function GalleryGuesses({
  players,
  playersSay,
  playersPoints,
  characters,
  currentColor,
  currentPlayer,
  round,
  imageCardMode,
}: GalleryGuessesProps) {
  const entries = orderBy(
    Object.entries(playersSay).map(([cardId, playersIds]) => {
      return {
        cardId,
        character: characters[cardId],
        playersIds,
        count: playersIds.length,
        isCorrect: currentPlayer.character.id === cardId,
      };
    }),
    ['isCorrect', 'count', 'card.text'],
    ['desc', 'desc', 'asc'],
  );
  const correctGuesses = playersSay[currentPlayer.character.id];

  return (
    <Space className="q-gallery__info-container" direction="vertical">
      <Space className="q-gallery__votes" direction="vertical">
        <div className="q-gallery__label">
          <Translate pt="Jogadores votaram" en="Players voted" />
        </div>
        {entries.map((entry, index) => {
          return (
            <div key={`guess-${entry.cardId}-${index}`} className="q-gallery__guess">
              <div
                className="q-gallery__speech-bubble"
                style={entry.isCorrect ? { backgroundColor: currentColor, color: 'white' } : {}}
              >
                {entry.isCorrect ? (
                  <CrownFilled className="q-gallery__speech-bubble-icon" style={{ color: 'white' }} />
                ) : (
                  <MessageFilled className="q-gallery__speech-bubble-icon" />
                )}
                {imageCardMode ? (
                  <ImageCard id={entry.character.id} cardWidth={35} className="inline" />
                ) : (
                  <DualTranslate>{entry.character.name}</DualTranslate>
                )}
              </div>
              <div className="q-gallery__players">
                <AntAvatar.Group>
                  {entry.playersIds.map((playerId) => (
                    <Avatar
                      id={players[playerId].avatarId}
                      key={`guess-avatar-${players[playerId].avatarId}`}
                    />
                  ))}
                </AntAvatar.Group>
                <span className="q-gallery__players-names">
                  {getPlayerNamesFromIds(entry.playersIds, players).join(', ')}
                </span>
              </div>
            </div>
          );
        })}
      </Space>

      <Space className="q-gallery__votes" direction="vertical">
        <div className="q-gallery__label">
          <Translate pt="Pontos" en="Points" />
        </div>

        {correctGuesses.length ? (
          <>
            <div className="q-gallery__players">
              <AntAvatar.Group>
                {correctGuesses.map((playerId) => {
                  return <Avatar key={`correct-guess-avatar-${playerId}`} id={players[playerId].avatarId} />;
                })}
              </AntAvatar.Group>
              <StarPoints quantity={round.current} keyPrefix={`guessers-points-${currentPlayer.id}`} />
              <span className="q-gallery__players-names">
                {getPlayerNamesFromIds(correctGuesses, players).join(', ')}
              </span>
            </div>
            <div className="q-gallery__player-points">
              <Avatar id={currentPlayer.avatarId} />{' '}
              <StarPoints
                quantity={playersPoints?.[currentPlayer.id]}
                keyPrefix={`artist-points-${currentPlayer.id}`}
              />{' '}
              <span className="q-gallery__players-names">{currentPlayer.name}</span>
            </div>
          </>
        ) : (
          <Typography.Text className="q-gallery__no-wins">
            <IconAvatar icon={<GarbageIcon />} size="large" shape="square" />
            <Translate
              pt="Nossa, ninguém acertou. Esses ícones devem ter sido uma bosta heim."
              en="Wow, nobody got it. You must have chosen terrible glyphs. Shame..."
            />
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
}
