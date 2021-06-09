import React from 'react';
// Design Resources
import { Button, Popconfirm, Progress } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// Images
import gameOverTitle from '../../images/game-over-title.svg';
// Utils
import { useAPICall, useLoading } from '../../hooks';
import { GAME_API } from '../../adapters';
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';
// Components
import PhaseContainer from './PhaseContainer';
import { Avatar } from '../avatars';
import AdminOnly from './AdminOnly';

function GameOver({ info, state, children }) {
  const [isLoading] = useLoading();

  const onPlayAgain = useAPICall({
    apiFunction: GAME_API.playAgain,
    actionName: 'play-=again',
    successMessage: 'Jogando novamente o mesmo jogo!',
    errorMessage: 'Vixi, ocorreu um erro ao tentar ir reiniciar o jogo',
  });

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase="GAME_OVER" className="game-over">
      <div className="game-over__title">
        <img src={gameOverTitle} alt="Game Over" />
      </div>

      {Boolean(state.winners) && (
        <div className="game-over__winner-container">
          <div className="game-over__text">
            Jogo concluido e {state.winners.length > 1 ? 'os vencedores são' : 'o vencedor é'}:
          </div>
          <ul className="game-over__winners">
            {state.winners.map((winner) => {
              return (
                <li className="game-over__winner" key={`winner-${winner.name}`}>
                  <Avatar className="game-over__avatar" id={winner.avatarId ?? 25} />
                  <div className="game-over__winner-name">
                    <strong>{winner.name ?? '?'}</strong>, {AVATAR_DESCRIPTIONS_BR[winner.avatarId]}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {Boolean(state.group) && (
        <div className="game-over__winner">
          <div className="game-over__text">Jogo concluido.</div>
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
            {state.group.victory ? 'Parabéns, vocês ganharam!' : 'Não foi dessa vez, que vergonha heim!'}
          </div>
        </div>
      )}

      {Boolean(state.team) && (
        <div className="game-over__winner">
          <div className="game-over__text">Jogo concluido.</div>
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
            {state.team.victory ? 'Parabéns, vocês ganharam!' : 'Não foi dessa vez, que vergonha heim!'}
          </div>
        </div>
      )}

      {!Boolean(state.winners) && !Boolean(state.team) && !Boolean(state.group) && (
        <div className="game-over__text">Jogo concluido.</div>
      )}

      {children}

      <AdminOnly>
        <Popconfirm
          title="Tem certeza que que jogar este jogo novamente??"
          onConfirm={() => onPlayAgain({})}
          okText="Sim"
          cancelText="Não"
        >
          <Button icon={<RocketFilled />} danger type="primary" disabled={isLoading}>
            Jogar novamente
          </Button>
        </Popconfirm>
      </AdminOnly>
    </PhaseContainer>
  );
}

export default GameOver;
