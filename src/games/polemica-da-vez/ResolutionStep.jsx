import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { DislikeFilled, FallOutlined, LikeFilled, RiseOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import {
  ButtonContainer,
  RankingBoard,
  Step,
  StepSwitcher,
  TimedButton,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import { AdminForceNextPhase } from '../../components/admin';
import { Topic } from './Topic';
import { Avatar } from '../../components/avatars';
import clsx from 'clsx';

function ResolutionStep({ ranking, players, totalLikes, customTopic, currentTopic }) {
  const language = useLanguage();
  const [step, setStep] = useState(0);

  return (
    <div className="p-step">
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

      <StepSwitcher step={step}>
        <Step key={0}>
          <Title>
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
                        <LikeFilled className="p-icon-like" />
                      ) : (
                        <DislikeFilled className="p-icon-dislike" />
                      )}
                    </div>
                  </div>
                  <div className="p-player-reaction__player">
                    <Avatar id={player.avatarId} />
                    <div className="p-player-reaction__name">{player.name}</div>
                  </div>
                  <div className="">
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
              onExpire={() => setStep(1)}
              onClick={() => setStep(1)}
              label="Ranking"
            />
          </ButtonContainer>
        </Step>

        <Step key={1}>
          <RankingBoard ranking={ranking} players={players} />
          <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
        </Step>
      </StepSwitcher>
    </div>
  );
}

ResolutionStep.propTypes = {
  currentTopic: PropTypes.shape({
    text: PropTypes.string,
  }),
  customTopic: PropTypes.string,
  players: PropTypes.object,
  ranking: PropTypes.array,
  totalLikes: PropTypes.number,
};

export default ResolutionStep;
