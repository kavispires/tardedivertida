// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { LocationIcon } from 'icons/LocationIcon';
import { PeopleAssessmentIcon } from 'icons/PeopleAssessmentIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { PhaseBoardSetupState } from './utils/types';
import {
  useOnSubmitSocialGroupAPIRequest,
  useOnUpdateDetectiveLocationAPIRequest,
} from './utils/api-requests';
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { StepSetupGossiper } from './StepSetupGossiper';
import { StepSetupDetective } from './StepSetupDetective';

export function PhaseBoardSetup({ players, state }: PhaseProps<PhaseBoardSetupState>) {
  const user = useUser(players, state);
  const { step } = useStep();
  const [, isTheGossiperPlayer] = useWhichPlayerIsThe('gossiperPlayerId', state, players);
  // const [, isTheDetectivePlayer] = useWhichPlayerIsThe('detectivePlayerId', state, players);

  const onSubmitAssociatedSocialGroup = useOnSubmitSocialGroupAPIRequest();
  const onSubmitDetectiveLocation = useOnUpdateDetectiveLocationAPIRequest();

  const gossiperAnnouncement = (
    <PhaseAnnouncement
      icon={<PeopleAssessmentIcon />}
      title={<Translate pt="Quem são seus aliados" en="Who are your allies?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="After looking what character you are, select one of 3 social groups to be your allies and eventually lie for you"
          pt="Depois de ver qual personagem você é, selecione um dos 3 grupos sociais para serem seus aliados e eventualmente mentirem por você"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  const detectiveAnnouncement = (
    <PhaseAnnouncement
      icon={<LocationIcon />}
      title={<Translate pt="Onde você começa investigando?" en="Where do you start investigating?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          en="Select one location as your starting position"
          pt="Selecione uma localização como sua posição inicial"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={FOFOCA_QUENTE_PHASES.BOARD_SETUP}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isTheGossiperPlayer}>
          <StepSetupGossiper
            user={user}
            players={players}
            announcement={gossiperAnnouncement}
            schoolBoard={state.schoolBoard}
            students={state.students}
            socialGroups={state.socialGroups}
            gossiperId={state.gossiperId}
            bestFriendId={state.bestFriendId}
            staff={state.staff}
            motivations={state.motivations}
            gossiperMotivationIndex={state.gossiperMotivationIndex}
            onSubmitAssociatedSocialGroup={onSubmitAssociatedSocialGroup}
          />

          <StepSetupDetective
            user={user}
            players={players}
            announcement={detectiveAnnouncement}
            schoolBoard={state.schoolBoard}
            students={state.students}
            socialGroups={state.socialGroups}
            gossiperId={state.gossiperId}
            bestFriendId={state.bestFriendId}
            staff={state.staff}
            motivations={state.motivations}
            onSubmitDetectiveLocation={onSubmitDetectiveLocation}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
