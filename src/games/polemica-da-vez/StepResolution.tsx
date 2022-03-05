import clsx from 'clsx';
// Design Resources
import { FallOutlined, RiseOutlined } from '@ant-design/icons';
// Components
import { Avatar, AvatarIcon, ButtonContainer, Step, TimedButton, Title, Translate } from 'components';
import { Topic } from './Topic';

type StepResolutionProps = {
  players: GamePlayers;
  totalLikes: number;
  customTopic: string;
  currentTopic: Topic;
  setStep: GenericFunction;
};
export function StepResolution({
  players,
  totalLikes,
  customTopic,
  currentTopic,
  setStep,
}: StepResolutionProps) {
  return (
    <Step className="p-step">
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <Title level={2}>
        <Topic topic={customTopic ?? currentTopic?.text} likes={totalLikes} />
      </Title>

      <ul className="p-players-reactions">
        {Object.values(players).map((player) => {
          const key = `player-result-${player.id}`;
          const isCorrect = player.likesGuess === totalLikes;
          return (
            <li className="p-player-reaction" key={key}>
              <div>
                <div className="p-player-reaction__reaction">
                  {player.reaction ? (
                    <AvatarIcon type="speech-bubble-thumbs-up" shape="square" className="p-like-icon" />
                  ) : (
                    <AvatarIcon type="speech-bubble-thumbs-down" shape="square" className="p-like-icon" />
                  )}
                </div>
              </div>
              <div className="p-player-reaction__player">
                <Avatar id={player.avatarId} />
                <div className="p-player-reaction__name">{player.name}</div>
              </div>
              <div>
                <div className={clsx('p-player-reaction__likes', isCorrect && 'p-icon-correct')}>
                  {isCorrect ? <RiseOutlined /> : <FallOutlined />} {player.likesGuess}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <ButtonContainer>
        <TimedButton
          duration={25}
          showTimer
          onExpire={() => setStep(2)}
          onClick={() => setStep(2)}
          label="Ranking"
        />
      </ButtonContainer>
    </Step>
  );
}
