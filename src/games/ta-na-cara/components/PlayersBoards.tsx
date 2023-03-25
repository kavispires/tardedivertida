// Ant Design Resources
import { Space } from 'antd';
// Hook
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAvatarColorById, sortPlayers } from 'utils/helpers';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { ImageCard } from 'components/cards';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type PlayersBoardsProps = {
  players: GamePlayers;
  user: GamePlayer;
  questionsDict: QuestionsDictionary;
};

export function PlayersBoards({ players, user, questionsDict }: PlayersBoardsProps) {
  const playersList = sortPlayers(players, 'name');
  const cardWidth = useCardWidth(10, 16, 80, 150, 16);

  return (
    <Space wrap className="players-boards space-container">
      {playersList.map((player) => (
        <PlayerBoard
          key={player.id}
          player={player}
          cardWidth={cardWidth / 2}
          userCharacterId={player.id === user.id ? user.characterId : undefined}
          questionsDict={questionsDict}
          history={user.history?.[player.id]}
        />
      ))}
    </Space>
  );
}

type PlayerBoardProps = {
  player: GamePlayer;
  cardWidth: number;
  userCharacterId?: CardId;
  questionsDict: QuestionsDictionary;
  history?: CardId[];
};

export function PlayerBoard({
  player,
  cardWidth,
  userCharacterId,
  questionsDict,
  history,
}: PlayerBoardProps) {
  return (
    <div
      className="player-board"
      style={{ backgroundColor: getAvatarColorById(player.avatarId), opacity: '0.95' }}
    >
      <div className="player-board__image">
        <ImageCard
          imageId={userCharacterId ?? 'us-unknown'}
          cardWidth={cardWidth}
          className="player-board__unknown-character"
        />
      </div>
      <div className="player-board__points">
        <PointsHighlight>{Math.max(10 - (player?.answers?.length ?? 0), 1)}</PointsHighlight>
      </div>
      <div className="player-board__avatar">
        <AvatarCard player={player} size="small" withName withRoundCorners addressUser />
      </div>
      <ul className="player-board__history">
        {Boolean(player?.answers?.length) &&
          player.answers.map((entry: BooleanDictionary) => {
            const [questionId, answer] = Object.entries(entry)[0];

            return (
              <li key={`${player.id}-${questionId}`}>
                {questionsDict[questionId].question}
                <IconAvatar
                  icon={answer ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
                  size="small"
                />
              </li>
            );
          })}
        {Boolean(history) &&
          history?.map((characterId) => {
            return (
              <li key={`${player.id}-${characterId}`} className="player-board__history-previous-guess">
                <ImageCard imageId={characterId} cardWidth={cardWidth / 3} />
                <IconAvatar icon={<SpeechBubbleDeclinedIcon />} size="small" />
              </li>
            );
          })}
      </ul>
    </div>
  );
}
