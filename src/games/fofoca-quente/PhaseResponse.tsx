// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { BullyingIcon } from '@icons/BullyingIcon';
import { PigeonIcon } from '@icons/PigeonIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { StepResponse } from './StepResponse';

export function PhaseResponse({ state, players, user }: PhaseProps<FofocaQuenteDefaultState>) {
  const { step } = useStep();
  const [gossiper] = useWhichPlayerIsThe('gossiperPlayerId', state, players);

  const announcement = gossiper.skipRumor ? (
    <PhaseAnnouncement
      icon={<PigeonIcon />}
      title={
        <Translate
          pt="Uai, nada?"
          en="Huh, nothing?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="The gossiper have skipped this turn and did not spread any new rumors"
          pt="O fofoqueiro pulou esta vez e não espalhou nenhum boato novo"
        />
      </Instruction>
    </PhaseAnnouncement>
  ) : (
    <PhaseAnnouncement
      icon={<BullyingIcon />}
      title={
        <Translate
          pt="Nossa, você não vai acreditar no que eu ouvi..."
          en="Wow, you won't believe what I heard..."
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="The gossiper have spread a rumor, everybody is shocked!"
          pt="O fofoqueiro espalhou um boato, todo mundo ficou chocado!"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={FOFOCA_QUENTE_PHASES.RESPONSE}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResponse
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
