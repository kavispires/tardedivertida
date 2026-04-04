// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BlackmailIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { StepIntimidation } from './StepIntimidation';

export function PhaseIntimidation({ state, players, user }: PhaseProps<FofocaQuenteDefaultState>) {
  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<BlackmailIcon />}
      title={
        <Translate
          pt="Intimidação"
          en="Intimidation"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="The gossiper must intimidate two students"
          pt="O fofoqueiro tem que intimidar dois estudantes"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FOFOCA_QUENTE_PHASES.INTIMIDATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepIntimidation
          user={user}
          players={players}
          announcement={announcement}
          schoolBoard={state.schoolBoard}
          students={state.students}
          socialGroups={state.socialGroups}
          gossiperId={state.gossiperId}
          bestFriendId={state.bestFriendId}
          staff={state.staff}
          motivations={state.motivations}
          gossiperMotivationIndex={state.gossiperMotivationIndex}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
