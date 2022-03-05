import { useState } from 'react';
// Design Resources
import { Button } from 'antd';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  AdminNextRoundButton,
  ButtonContainer,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  PopoverRule,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  Translate,
} from 'components';
import { StepReveal } from './StepReveal';
import { ScoringRules } from './RulesBlobs';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);
  const [psychic] = useWhichPlayerIsThe('psychicId', state, players);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.REVEAL}
      className="o-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="timer"
          title={translate('Resultado', 'Results')}
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
          <Title level={1}>Ranking</Title>

          <PopoverRule
            label={<Translate pt="Como a pontuação funciona?" en="How does scoring work?" />}
            content={<ScoringRules />}
          />

          <RankingBoard ranking={state.ranking} players={players} />
          <ButtonContainer>
            <Button onClick={() => setStep(1)}>
              <Translate pt="Ver resultado novamente" en="See results again" />
            </Button>
          </ButtonContainer>
          <AdminNextRoundButton round={state.round} lastRound={state?.lastRound} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
