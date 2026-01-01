// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { WriteIdeaIcon } from 'icons/collection';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type { PhaseCategoryCreationState } from './utils/types';
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { useOnSkipTurnAPIRequest, useOnSubmitCategoryAPIRequest } from './utils/api-requests';
import { StepCreateCategory } from './StepCreateCategory';
import { StepWaitForCreation } from './StepWaitForCreation';

export function PhaseCategoryCreation({ players, state, user }: PhaseProps<PhaseCategoryCreationState>) {
  const { step, setStep } = useStep();
  const [creator, isTheCreator] = useWhichPlayerIsThe('creatorId', state, players);

  const onSubmitCategory = useOnSubmitCategoryAPIRequest(setStep);
  const onSkipTurn = useOnSkipTurnAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<WriteIdeaIcon />}
      title={<Translate pt="Novo Quesito" en="New Category" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              É a vez de <PlayerAvatarName player={creator} addressUser /> criar a categoria
            </>
          }
          en={
            <>
              It's <PlayerAvatarName player={creator} addressUser />
              's turn to create the category
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={QUAL_QUESITO_PHASES.CATEGORY_CREATION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isTheCreator}>
          <StepCreateCategory
            user={user}
            players={players}
            cardsDict={state?.cardsDict}
            announcement={announcement}
            onSubmitCategory={onSubmitCategory}
            onSkipTurn={onSkipTurn}
            turnOrder={state.turnOrder}
          />

          <StepWaitForCreation
            user={user}
            players={players}
            cardsDict={state?.cardsDict}
            announcement={announcement}
            creator={creator}
            turnOrder={state.turnOrder}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
