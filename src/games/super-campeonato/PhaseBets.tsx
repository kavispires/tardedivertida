// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { GamblingChipIcon } from '@icons/GamblingChipIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import { useOnSubmitBetsAPIRequest } from './utils/api-requests';
import type { PhaseBetsState } from './utils/type';
import { SUPER_CAMPEONATO_PHASES } from './utils/constants';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { StepMakeYourBets } from './StepMakeYourBets';

export function PhaseBets({ state, players, user }: PhaseProps<PhaseBetsState>) {
  const { step, setStep } = useStep(0);

  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<GamblingChipIcon />}
      title={
        <Translate
          pt="Apostas"
          en="Bets"
        />
      }
      type="overlay"
      currentRound={state?.round?.current}
      duration={5}
    >
      <Instruction>
        <Translate
          pt="Selecione quem você acha que ganha as quartas de final, semi final e final"
          en="Place bet on who you think will win the quarter-finals, semifinals, and finals"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SUPER_CAMPEONATO_PHASES.BETS}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: Boolean(user.bets?.final) && (
            <BetsFloatingHand
              bets={user.bets}
              brackets={state.brackets}
              selectedContenderIds={user.selectedContenderIds}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <StepMakeYourBets
          onSubmitBets={onSubmitBets}
          challenge={state.challenge}
          brackets={state.brackets}
          players={players}
          announcement={announcement}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
