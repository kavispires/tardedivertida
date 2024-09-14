// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { TurbanIcon } from 'icons/TurbanIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './utils/api-requests';
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';

export function PhaseDialClue({ players, state, info }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);
  const [psychic, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendChosenSide = useOnSubmitCategoryAPIRequest();

  const onSendClue = useOnSubmitClueAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<TurbanIcon />}
      title={<Translate pt="Concentração" en="Focus" />}
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Para essa rodada, <AvatarName player={psychic} addressUser /> será o(a) Medium.
            </>
          }
          en={
            <>
              For this round, <AvatarName player={psychic} addressUser /> will be the Psychic.
            </>
          }
        />
        <TurnOrder players={players} order={state.gameOrder} activePlayerId={state.psychicId} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_CLUE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <ViewOr condition={isUserThePsychic}>
          <ViewOr condition={!state.currentCategoryId}>
            <StepCategorySelection
              currentCategories={state.currentCategories}
              onSendChosenSide={onSendChosenSide}
              announcement={announcement}
            />
            <StepClueWriting
              currentCategories={state.currentCategories}
              currentCategoryId={state.currentCategoryId}
              target={state.target}
              onSendClue={onSendClue}
            />
          </ViewOr>
          <StepClueWaiting
            players={players}
            psychic={psychic}
            currentCategories={state.currentCategories}
            currentCategoryId={state.currentCategoryId}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
