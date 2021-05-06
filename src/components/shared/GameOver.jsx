import React from 'react';
// Images
import gameOverTitle from '../../images/game-over-title.svg';
// Components
import PhaseContainer from './PhaseContainer';
import Avatar from '../avatars/Avatar';
import { AVATAR_DESCRIPTIONS_BR } from '../../utils/constants';

function GameOver({ info, state }) {
  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase="GAME_OVER" className="game-over">
      <div className="game-over__container">
        <div className="game-over__title">
          <img src={gameOverTitle} alt="Game Over" />
        </div>
        {Boolean(state.winner) ? (
          <div className="game-over__winner">
            <div className="game-over__text">Jogo concluido e o vencedor é:</div>
            <Avatar className="game-over__avatar" id={state.winner?.avatarId ?? 25} />
            <div className="game-over__winner-name">
              <strong>{state.winner?.name ?? '?'}</strong>, {AVATAR_DESCRIPTIONS_BR[state.winner?.avatarId]}
            </div>
          </div>
        ) : (
          <div className="game-over__text">Jogo concluido.</div>
        )}
      </div>
    </PhaseContainer>
  );
}

export default GameOver;
