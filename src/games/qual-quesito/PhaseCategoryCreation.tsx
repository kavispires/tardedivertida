import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { WriteIdeaIcon } from '@icons/WriteIdeaIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
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
      title={
        <Translate
          pt="Novo Quesito"
          en="New Category"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="É a vez de {creator} criar a categoria"
          en="It's {creator}'s turn to create the category"
          values={{
            creator: (
              <PlayerAvatarName
                player={creator}
                addressUser
              />
            ),
          }}
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUAL_QUESITO_PHASES.CATEGORY_CREATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isTheCreator}>
            <StepCreateCategory
              user={user}
              players={players}
              cardsDict={state?.cardsDict}
              announcement={announcement}
              onSubmitCategory={onSubmitCategory}
              onSkipTurn={onSkipTurn}
              turnOrder={state.turnOrder}
            />
          </ViewIf>
          <ViewIf condition={!isTheCreator}>
            <StepWaitForCreation
              user={user}
              players={players}
              cardsDict={state?.cardsDict}
              announcement={announcement}
              creator={creator}
              turnOrder={state.turnOrder}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
