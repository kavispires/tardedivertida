import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Hooks
import { useLanguage } from '../../../hooks';
// Components
import {
  GameOver,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  translate,
  Translate,
} from '../../shared';
import { CanvasSVG } from '../../canvas';
import DrawingGrade from './DrawingGrade';

function PhaseGameOver({ state, players, info }) {
  const [step, setStep] = useState(0);
  const language = useLanguage();

  return (
    <StepSwitcher step={step}>
      {/*Step 0 */}
      <PhaseContainer info={info} phase={state?.phase} allowedPhase="GAME_OVER" className="game-over">
        <PhaseAnnouncement
          type="evaluate"
          title={translate('E o jogo chegou ao fim...', 'And the game is over...', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={4}
        />
      </PhaseContainer>

      <GameOver info={info} state={state}>
        {/*Step 1 */}
        <ul className="a-game-over__gallery">
          {state.drawings.map((entry) => {
            return (
              <li className="a-game-over__gallery-item" key={entry.drawing}>
                <CanvasSVG drawing={entry.drawing} size={200} className="a-game-over__gallery-canvas" />
                <span className="a-game-over__credits">
                  "{entry.text}" <Translate pt="por" en="by" /> {players[entry.playerId].name}
                </span>
                <DrawingGrade value={entry.successRate} />
              </li>
            );
          })}
        </ul>
      </GameOver>
    </StepSwitcher>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    drawings: PropTypes.array,
  }),
};

export default PhaseGameOver;
