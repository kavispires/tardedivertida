// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { STATUS } from './utils/constants';
import { StepVerification } from './StepVerification';

export function PhaseVerification({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step } = useStep();

  const announcement =
    state.status === STATUS.LOSE ? (
      <PhaseAnnouncement
        icon={<NuclearExplosionIcon />}
        title={<Translate pt="Nãaaaaaooooooo" en="Nooooooooo" />}
        currentRound={state?.round?.current}
        type="overlay"
        duration={4}
      />
    ) : undefined;

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_DUO.VERIFICATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepVerification
          user={user}
          players={players}
          deckType={state.deckType}
          deck={state.deck}
          status={state.status}
          history={state.history}
          summary={state.summary}
          clueInputType={state.clueInputType}
          clue={state.clue}
          clueQuantity={state.clueQuantity}
          round={state.round}
          entryIdToAnimate={state.entryIdToAnimate}
          nextPhase={state.nextPhase}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
