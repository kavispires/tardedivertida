import React from 'react';
// Components
import GameOver from '../../shared/GameOver';
import CanvasSVG from './CanvasSVG';
import DrawingGrade from './DrawingGrade';

function GameOverPhase({ state, info }) {
  return (
    <GameOver info={info} state={state}>
      <ul className="a-game-over__gallery">
        {state.drawings.map((entry) => {
          return (
            <li className="a-game-over__gallery-item" key={entry.drawing}>
              <CanvasSVG drawing={entry.drawing} size={200} className="a-game-over__gallery-canvas" />
              <span className="a-game-over__credits">
                "{entry.text}" por {entry.playerName}
              </span>
              <DrawingGrade value={entry.successRate} />
            </li>
          );
        })}
      </ul>
    </GameOver>
  );
}

export default GameOverPhase;
