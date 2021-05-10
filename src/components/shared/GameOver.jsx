import React from 'react';
// Images
import gameOverTitle from '../../images/game-over-title.svg';
// Components
import PhaseContainer from './PhaseContainer';
import Avatar from '../avatars/Avatar';
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';
import { Progress } from 'antd';

function GameOver({ info, state, children }) {
  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase="GAME_OVER" className="game-over">
      {/* <div className="game-over__container"> */}
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

      {!Boolean(state.winners) && !Boolean(state.team) && (
        <div className="game-over__text">Jogo concluido.</div>
      )}
      {/* </div> */}

      {children}
    </PhaseContainer>
  );
}

export default GameOver;
