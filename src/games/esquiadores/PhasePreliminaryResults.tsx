// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { SkiingIcon } from 'icons/SkiingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhasePreliminaryResultsState } from './utils/types';
import { SnowEffect } from './components/SnowEffect';
import { StepResults } from './StepResults';
// Icons

export function PhasePreliminaryResults({ players, state }: PhaseProps<PhasePreliminaryResultsState>) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [skier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SkiingIcon />}
      title={<Translate pt="Segunda descida" en="Second slope" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>...</Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.ESQUIADORES.PRELIMINARY_RESULTS}>
      <SnowEffect />
      <StepSwitcher step={step} players={players}>
        {/* Step 1 */}
        <StepResults
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          skier={skier}
          mountain={state.mountain}
          lodges={state.lodges}
          betType="boost"
          animateFrom={state.animateFrom}
          animateTo={state.animateTo}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
