// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BlackmailIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { FofocaQuenteProvider } from './components/FofocaQuenteContext';
import { StepIntimidation } from './StepIntimidation';
// Icons

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
      <FofocaQuenteProvider
        state={state}
        players={players}
        user={user}
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
      </FofocaQuenteProvider>
    </PhaseContainer>
  );
}
