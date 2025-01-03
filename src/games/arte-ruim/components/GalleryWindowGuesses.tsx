import { orderBy } from 'lodash';
// Ant Design Resources
import { CrownFilled, MessageFilled } from '@ant-design/icons';
import { Avatar as AntAvatar } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getPlayersFromIds } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import type { ArteRuimCard } from '../utils/types';
import type { PlayersSay } from '../utils/types';

type GalleryWindowGuessesProps = {
  playersSay: PlayersSay;
  players: GamePlayers;
  cards: ArteRuimCard[];
  windowCardId: string;
  artistColor: string;
};

export function GalleryWindowGuesses({
  playersSay,
  players,
  cards,
  windowCardId,
  artistColor,
}: GalleryWindowGuessesProps) {
  const entries = orderBy(
    Object.entries(playersSay).map(([cardId, playersIds]) => {
      return {
        cardId,
        card: cards.find((i) => i.id === cardId),
        playersIds,
        count: playersIds.length,
        isCorrect: windowCardId === cardId,
      };
    }),
    ['isCorrect', 'count', 'card.text'],
    ['desc', 'desc', 'asc'],
  );

  return (
    <div className="a-gallery__guesses">
      <div className="a-gallery__label">
        <Translate pt="Participantes votaram" en="Players voted" />
      </div>
      {entries.map((entry, index) => {
        return (
          <div key={`guess-${entry.cardId}-${index}`} className="a-gallery__guess">
            <div
              className="a-gallery__speech-bubble"
              style={entry.isCorrect ? { backgroundColor: artistColor, color: 'white' } : {}}
            >
              {entry.isCorrect ? (
                <CrownFilled className="a-gallery__speech-bubble-icon" style={{ color: 'white' }} />
              ) : (
                <MessageFilled className="a-gallery__speech-bubble-icon" />
              )}
              {entry.card?.text}
            </div>
            <div className="a-gallery__players">
              <AntAvatar.Group>
                {entry.playersIds.map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`guess-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="a-gallery__players-names">
                {getPlayersFromIds(entry.playersIds, players, true).join(', ')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
