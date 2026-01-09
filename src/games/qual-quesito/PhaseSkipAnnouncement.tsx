// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SkipIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import type { PhaseSkipAnnouncementState } from './utils/types';
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { StepAnnounceSkipTurn } from './StepAnnounceSkipTurn';

export function PhaseSkipAnnouncement({ players, state, user }: PhaseProps<PhaseSkipAnnouncementState>) {
  const { step } = useStep();
  const [creator] = useWhichPlayerIsThe('creatorId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SkipIcon />}
      title={
        <Translate
          pt="Pula a vez"
          en="Skip Turn"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUAL_QUESITO_PHASES.SKIP_ANNOUNCEMENT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepAnnounceSkipTurn
          user={user}
          players={players}
          cardsDict={state?.cardsDict}
          announcement={announcement}
          creator={creator}
          turnOrder={state.turnOrder}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
