import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useWhichPlayerIsThe, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import { Avatar } from '../../components/avatars';
import StepResolution from './StepResolution';
import StepRanking from './StepRanking';

function PhaseResolution({ state, players, info }) {
  const language = useLanguage();
  const storyteller = useWhichPlayerIsThe('storyteller', state, players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CONTADORES_HISTORIAS.RESOLUTION}
      className="c-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="seal"
          title={translate('Solução', 'Solution', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Hora de revelar a resposta correta!
                  <br />O Contador de Histórias {<Avatar id={storyteller.avatarId} size="small" />} ganha 3
                  pontos se pelo menos uma pessoa acertar (mas não todas).
                  <br />
                  Cada jogador que votou corretamente ganha 3 pontos.
                  <br />
                  Para cada voto que sua carta recebeu (menos{' '}
                  {<Avatar id={storyteller.avatarId} size="small" />}), você ganha 1 ponto.
                  <br />
                  Mas se todos jogadores votarem corretamente ou incorretamente, todos ganham 2 pontos e o
                  Contador de Histórias não ganha nada.
                </>
              }
              en={
                <>
                  Time to reveal the answer!
                  <br />
                  The Storyteller {<Avatar id={storyteller.avatarId} size="small" />} gets 3 points if at
                  least one player got it correctly (but not all).
                  <br />
                  Each player who voted correctly gets 3 points.
                  <br />
                  Each vote your card receives grants you 1 points (except{' '}
                  {<Avatar id={storyteller.avatarId} size="small" />}).
                  <br />
                  But if all players vote correctly or incorrectly, they get 2 points each and the Storyteller
                  gets nothing.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepResolution
            players={players}
            story={state.story}
            storyteller={storyteller}
            table={state.table}
            setStep={setStep}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <StepRanking
            players={players}
            ranking={state.ranking}
            outcome={state.outcome}
            storyteller={storyteller}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseResolution.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    outcome: PropTypes.string,
    phase: PropTypes.string,
    ranking: PropTypes.array,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    story: PropTypes.string,
    table: PropTypes.arrayOf(
      PropTypes.shape({
        playerId: PropTypes.string,
        cardId: PropTypes.string,
        votes: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
};

export default PhaseResolution;
