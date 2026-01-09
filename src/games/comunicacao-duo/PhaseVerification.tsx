// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { NuclearExplosionIcon } from 'icons/NuclearExplosionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { COMUNICACAO_DUO_PHASES, STATUS } from './utils/constants';
import { StepVerification } from './StepVerification';

export function PhaseVerification({ players, state, user }: PhaseProps) {
  const { step } = useStep();

  const announcement =
    state.status === STATUS.LOSE ? (
      <PhaseAnnouncement
        icon={<NuclearExplosionIcon />}
        title={
          <Translate
            pt="Nãaaaaaooooooo"
            en="Nooooooooo"
          />
        }
        currentRound={state?.round?.current}
        type="overlay"
        duration={4}
      />
    ) : undefined;

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={COMUNICACAO_DUO_PHASES.VERIFICATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
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
