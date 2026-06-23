// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { CyberBullyingIcon } from '@icons/CyberBullyingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { StepRumor } from './StepRumor';

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
    </PhaseContainer>
  );
}
