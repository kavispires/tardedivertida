// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SkiingIcon } from 'icons/SkiingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseStartingResultsPhase } from './utils/types';
import { ESQUIADORES_PHASES } from './utils/constants';
import { SnowEffect } from '../../components/visual-effects/SnowEffect';
import { StepResults } from './StepResults';
// Icons

export function PhaseStartingResults({ players, state, user }: PhaseProps<PhaseStartingResultsPhase>) {
  const { step } = useStep();
  const [skier] = useWhichPlayerIsThe('activeSkierId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SkiingIcon />}
      title={<Translate pt="Primeira descida" en="First slope" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>...</Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={ESQUIADORES_PHASES.STARTING_RESULTS}>
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
          betType="initial"
          animateFrom={state.animateFrom}
          animateTo={state.animateTo}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
