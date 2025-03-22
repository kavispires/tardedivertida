// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseIntimidationState } from './utils/types';
import { useOnSubmitIntimidationAPIRequest } from './utils/api-requests';
import { StepIntimidation } from './StepIntimidation';
// Icons

export function PhaseIntimidation({ players, state }: PhaseProps<PhaseIntimidationState>) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [, isTheGossiperPlayer] = useWhichPlayerIsThe('gossiperPlayerId', state, players);
  const [, isTheDetectivePlayer] = useWhichPlayerIsThe('detectivePlayerId', state, players);

  const onSubmitIntimidation = useOnSubmitIntimidationAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<TDIcon />}
      title={<Translate pt="Intimidação" en="Intimidation" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="The gossiper will have to intimidate two students"
          pt="O fofoqueiro terá que intimidar dois estudantes"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.FOFOCA_QUENTE.INTIMIDATION}>
      <StepSwitcher step={step} players={players}>
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
          onSubmitIntimidation={onSubmitIntimidation}
          isTheGossiperPlayer={isTheGossiperPlayer}
          isTheDetectivePlayer={isTheDetectivePlayer}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
