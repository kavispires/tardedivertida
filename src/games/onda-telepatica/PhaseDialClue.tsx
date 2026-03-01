// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TurbanIcon } from 'icons/TurbanIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayerAvatarName } from 'components/player';
import { TurnOrder } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './utils/api-requests';
import { ONDA_TELEPATICA_PHASES } from './utils/constants';
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';

export function PhaseDialClue({ state, players }: PhaseProps) {
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
        <TurnOrder
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
        <ViewIf condition={isUserThePsychic}>
          <ViewIf condition={!state.currentCategoryId}>
            <StepCategorySelection
              currentCategories={state.currentCategories}
              onSendChosenSide={onSendChosenSide}
              announcement={announcement}
            />
          </ViewIf>
          <ViewIf condition={state.currentCategoryId}>
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
