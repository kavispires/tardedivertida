import PropTypes from 'prop-types';
import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AdminNextRoundButton,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  translate,
  Translate,
} from '../../components';
import { StepReveal } from './StepReveal';

function PhaseReveal({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const [psychic] = useWhichPlayerIsThe('psychicId', state, players);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.REVEAL}
      className="o-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="timer"
          title={translate('Resultado', 'Results', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Hora de contar os pontos!" en="Time to score!" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <StepReveal
            players={players}
            psychic={psychic}
            currentCategory={state.currentCategory}
            setStep={setStep}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <Title level={1}>
            <Translate pt="Resultado" en="Results" />
          </Title>

          <RankingBoard ranking={state.ranking} players={players} />
          <AdminNextRoundButton round={state.round} lastRound={state?.lastRound} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseReveal.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseReveal;
