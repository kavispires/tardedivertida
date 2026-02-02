// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { BlackmailIcon } from 'icons/collection';
import { CyberBullyingIcon } from 'icons/CyberBullyingIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { FofocaQuenteProvider } from './components/FofocaQuenteContext';
import { StepRumor } from './StepRumor';
// Icons

export function PhaseRumor({ state, players, user }: PhaseProps<FofocaQuenteDefaultState>) {
  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<CyberBullyingIcon />}
      title={
        <Translate
          pt="Hora do Boato"
          en="Rumor Time"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="The gossiper must spread a rumor about a student following their motivation"
          pt="O fofoqueiro tem que espalhar um boato sobre um estudante seguindo sua motivação"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FOFOCA_QUENTE_PHASES.RUMOR}
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
          <StepRumor
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
            maySkipRumor={state.maySkipRumor}
          />
        </StepSwitcher>
      </FofocaQuenteProvider>
    </PhaseContainer>
  );
}
