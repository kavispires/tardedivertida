import { orderBy } from 'lodash';
// Ant Design Resources
import { Avatar as AntAvatar, Space, Typography } from 'antd';
import { CrownFilled, MessageFilled } from '@ant-design/icons';
// Utils
import { getPlayersFromIds } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { StarPoints } from 'components/points';
import { IconAvatar } from 'components/icons/IconAvatar';
import { GarbageIcon } from 'components/icons/GarbageIcon';

type GalleryGuessesProps = {
  players: GamePlayers;
  playersSay: Record<CardId, PlayerId[]>;
  playersPoints: NumberDictionary;
  characters: Characters;
  currentColor: string;
  currentPlayer: GamePlayer;
  round: GameRound;
};

export function GalleryGuesses({
  players,
  playersSay,
  playersPoints,
  characters,
  currentColor,
  currentPlayer,
  round,
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
    ['desc', 'desc', 'asc']
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
                <DualTranslate>{entry.character.name}</DualTranslate>
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
                  {getPlayersFromIds(entry.playersIds, players, true).join(', ')}
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
                {getPlayersFromIds(correctGuesses, players, true).join(', ')}
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
              en="Wow, nobody got it. It must have been chosen terrible glyphs. Shame..."
            />
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
}
