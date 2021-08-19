import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../../hooks';
// Components
import {
  GameOverPhase,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Title,
  translate,
} from '../../shared';
import { SheepAvatar } from '../../avatars';

function PhaseGameOver({ state, info }) {
  const [step, setStep] = useState(0);
  const language = useLanguage();

  return (
    <StepSwitcher step={step}>
      {/*Step 0 */}
      <PhaseContainer info={info} phase={state?.phase} allowedPhase="GAME_OVER" className="game-over">
        <PhaseAnnouncement
          type="game-over"
          title={translate('E o jogo chegou ao fim...', 'And the game is over...', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={4}
        />
      </PhaseContainer>

      <GameOverPhase info={info} state={state}>
        <Title>RIP</Title>
        <div className="m-sheep-rip">
          {state.losers.map((player) => {
            return (
              <div className="m-sheep-rip__entry" key={`sheep-player-1`}>
                <SheepAvatar id={player.avatarId} width={80} />
                <span className="m-sheep-rip__name">{player.name}</span>
              </div>
            );
          })}
        </div>
      </GameOverPhase>
    </StepSwitcher>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.object,
  state: PropTypes.shape({
    losers: PropTypes.array,
    winners: PropTypes.array,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseGameOver;
