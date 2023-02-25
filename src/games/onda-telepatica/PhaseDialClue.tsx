// State & Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useUser } from 'hooks/useUser';
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { TurbanIcon } from 'icons/TurbanIcon';
// Components
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { TurnOrder } from 'components/players';
import { ViewOr } from 'components/views';

function PhaseDialClue({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
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
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
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

export default PhaseDialClue;
