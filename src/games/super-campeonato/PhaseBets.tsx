// Hooks
import { useLanguage, useStep } from 'hooks';
import { useOnSubmitBetsAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepMakeYourBets } from './StepMakeYourBets';
import { GamblingChipIcon } from 'components/icons/GamblingChipIcon';

function PhaseBets({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.BETS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<GamblingChipIcon />}
          title={translate('Apostas', 'Bets')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate
              pt="Selecione quem você acha que ganha as quartas de final, semi final, final"
              en="Place bet on who you think will win the quarter-finals, semifinals and finals"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepMakeYourBets
          onSubmitBets={onSubmitBets}
          challenge={state.challenge}
          brackets={state.brackets}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBets;
