// Design Resources
import { Avatar as AntAvatar } from 'antd';
import { MessageFilled } from '@ant-design/icons';
// Utils
import { getPlayersFromIds } from '../../utils/helpers';
// Components
import { Avatar, Translate } from '../../components';

type GalleryWindowGuessesProps = {
  playersSay: PlayersSay;
  players: GamePlayers;
  cards: ArteRuimCard[];
};

function GalleryWindowGuesses({ playersSay, players, cards }: GalleryWindowGuessesProps) {
  return (
    <div className="a-gallery-window__guesses">
      <div className="a-gallery-window__label">
        <Translate pt="Participantes votaram" en="Players voted" />
      </div>
      {Object.entries(playersSay).map(([cardId, playerIds], index) => {
        const card = cards.find((i) => i.id === cardId);
        return (
          <div key={`guess-${cardId}-${index}`} className="a-gallery-window__guess">
            <div className="a-gallery-window__speech-bubble">
              <MessageFilled className="a-gallery-window__speech-bubble-icon" /> {card?.text}
            </div>
            <div className="a-gallery-window__players">
              <AntAvatar.Group>
                {playerIds.map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`guess-avatar-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
              <span className="a-gallery-window__players-names">
                {getPlayersFromIds(playerIds, players, true).join(', ')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GalleryWindowGuesses;
