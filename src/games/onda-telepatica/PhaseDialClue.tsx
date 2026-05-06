import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TurbanIcon } from 'icons/TurbanIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './utils/api-requests';
import { ONDA_TELEPATICA_PHASES } from './utils/constants';
import type { PhaseDialClueState } from './utils/types';
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';

export function PhaseDialClue({ state, players }: PhaseProps<PhaseDialClueState>) {
  const { step, goToNextStep } = useStep(0);
  const [psychic, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendChosenSide = useOnSubmitCategoryAPIRequest();

  const onSendClue = useOnSubmitClueAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<TurbanIcon />}
      title={
        <Translate
          pt="Concentração"
          en="Focus"
        />
      }
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Para essa rodada,{' '}
              <PlayerAvatarName
                player={psychic}
                addressUser
              />{' '}
              será o(a) Medium.
            </>
          }
          en={
            <>
              For this round,{' '}
              <PlayerAvatarName
                player={psychic}
                addressUser
              />{' '}
              will be the Psychic.
            </>
          }
        />
        <PlayersTurnOrder
          players={players}
          order={state.gameOrder}
          activePlayerId={state.psychicId}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ONDA_TELEPATICA_PHASES.DIAL_CLUE}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
        />

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserThePsychic}>
            <ViewIf condition={!state.currentCategoryId}>
              <StepCategorySelection
                currentCategories={state.currentCategories}
                onSendChosenSide={onSendChosenSide}
                announcement={announcement}
              />
            </ViewIf>
            <ViewIf condition={!!state.currentCategoryId}>
              <StepClueWriting
                currentCategories={state.currentCategories}
                currentCategoryId={state.currentCategoryId}
                target={state.target}
                onSendClue={onSendClue}
              />
            </ViewIf>
          </ViewIf>
          <ViewIf condition={!isUserThePsychic}>
            <StepClueWaiting
              players={players}
              psychic={psychic}
              currentCategories={state.currentCategories}
              currentCategoryId={state.currentCategoryId}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
