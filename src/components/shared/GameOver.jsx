import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Design Resources
import { Button, Popconfirm, Progress } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// Images
import gameOverTitle from '../../images/game-over-title.svg';
// Utils
import { useAPICall, useLanguage, useLoading } from '../../hooks';
import { GAME_API } from '../../adapters';
import { AVATARS } from '../../utils/constants';
// Components
import { Avatar } from '../avatars';
import { AdminOnly } from '../admin/index';
import { PhaseContainer } from './index';
import { translate, Translate } from './Translate';
import { StepSwitcher } from './StepSwitcher';
import { PhaseAnnouncement } from './PhaseAnnouncement';

const GameOverText = () => <Translate pt="Jogo concluído" en="The game is over" />;

export function GameOverPhase({ info, state, children }) {
  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase="GAME_OVER"
      className="game-over__container"
    >
      <GameOver info={info} state={state}>
        {children}
      </GameOver>
    </PhaseContainer>
  );
}

export function GameOver({ state, children, className }) {
  const language = useLanguage();
  const [isLoading] = useLoading();

  const onPlayAgain = useAPICall({
    apiFunction: GAME_API.playAgain,
    actionName: 'play-=again',
    successMessage: translate('Jogando novamente o mesmo jogo!', 'Restarting the same game', language),
    errorMessage: translate(
      'Vixi, ocorreu um erro ao tentar ir reiniciar o jogo',
      'Oops, the application found an error while trying to restart the game',
      language
    ),
  });

  return (
    <div className={className}>
      <div className="game-over__title">
        <img src={gameOverTitle} alt="Game Over" />
      </div>

      {Boolean(state.winners) && (
        <div className="game-over__winner-container">
          <div className="game-over__text">
            <GameOverText />{' '}
            {state.winners.length > 1 ? (
              <Translate pt="e os vencedores são" en="and the winners are" />
            ) : (
              <Translate pt="o vencedor é" en="and the winner is" />
            )}
            :
          </div>
          <ul className="game-over__winners">
            {state.winners.map((winner) => {
              return (
                <li className="game-over__winner" key={`winner-${winner.name}`}>
                  <Avatar className="game-over__avatar" id={winner.avatarId ?? 25} />
                  <div className="game-over__winner-name">
                    <strong>{winner.name ?? '?'}</strong>, {AVATARS[winner.avatarId].description[language]}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {Boolean(state.group) && (
        <div className="game-over__winner">
          <div className="game-over__text">
            <GameOverText />
          </div>
          <Progress
            type="circle"
            strokeColor={
              state.group.victory
                ? {
                    '0%': '#4ba226',
                    '100%': '#87d068',
                  }
                : {
                    '0%': '#ff0000',
                    '70%': '#ff0000',
                    '100%': '#87d068',
                  }
            }
            percent={state.group.score ?? 0}
          />
          <div className="game-over__text">
            {state.group.victory ? (
              <Translate pt="Parabéns, vocês ganharam!" en="Congratulations, you won!" />
            ) : (
              <Translate pt="Não foi dessa vez, que vergonha heim!" en="You lost! What a shame!" />
            )}
          </div>
        </div>
      )}

      {Boolean(state.team) && (
        <div className="game-over__winner">
          <div className="game-over__text">
            <GameOverText />
          </div>
          <Progress
            type="circle"
            strokeColor={{
              '0%': '#ff0000',
              '70%': '#ff0000',
              '100%': '#87d068',
            }}
            percent={state.team.score ?? 0}
          />
          <div className="game-over__text">
            {state.team.victory ? (
              <Translate pt="Parabéns, vocês ganharam!" en="Congratulations, you won!" />
            ) : (
              <Translate pt="Não foi dessa vez, que vergonha heim!" en="You lost! What a shame!" />
            )}
          </div>
        </div>
      )}

      {!Boolean(state.winners) && !Boolean(state.team) && !Boolean(state.group) && (
        <div className="game-over__text">
          <GameOverText />
        </div>
      )}

      {children}

      <AdminOnly>
        <Popconfirm
          title={translate(
            'Tem certeza que que jogar este jogo novamente?',
            'Are you sure you want to play this game again?',
            language
          )}
          onConfirm={() => onPlayAgain({})}
          okText={translate('Sim', 'Yes', language)}
          cancelText={translate('Não', 'No', language)}
        >
          <Button icon={<RocketFilled />} danger type="primary" disabled={isLoading}>
            <Translate pt="Jogar novamente" en="Play again" />
          </Button>
        </Popconfirm>
      </AdminOnly>
    </div>
  );
}

GameOver.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  state: PropTypes.shape({
    group: PropTypes.shape({
      score: PropTypes.number,
      victory: PropTypes.any,
    }),
    team: PropTypes.shape({
      score: PropTypes.number,
      victory: PropTypes.any,
    }),
    winners: PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func,
    }),
  }),
};

export function GameOverWrapper({
  info,
  state,
  announcementIcon,
  announcementTitle,
  announcementDuration,
  announcementContent,
  children,
}) {
  const [step, setStep] = useState(0);
  const language = useLanguage();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase="GAME_OVER"
      className="game-over__container"
    >
      <StepSwitcher step={step}>
        {/*Step 0 */}
        <PhaseAnnouncement
          type={announcementIcon ?? 'the-end'}
          title={translate(
            'E o jogo chegou ao fim...',
            'And the game is over...',
            language,
            announcementTitle
          )}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={announcementDuration || 3}
        >
          {announcementContent}
        </PhaseAnnouncement>

        <GameOver info={info} state={state}>
          {children}
        </GameOver>
      </StepSwitcher>
    </PhaseContainer>
  );
}

GameOverWrapper.propTypes = {
  announcementContent: PropTypes.any,
  announcementDuration: PropTypes.number,
  announcementIcon: PropTypes.oneOf(['trophy', 'the-end', 'flag', 'criminal', 'newspaper']),
  announcementTitle: PropTypes.string,
  children: PropTypes.any,
  info: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
    }),
  }),
};
