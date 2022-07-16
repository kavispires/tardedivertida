// State & Hooks
import { useIsUserReady, useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
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
import { TurbanIcon } from 'components/icons/TurbanIcon';

function PhaseDialClue({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);
  const [psychic, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendChosenSide = useOnSubmitCategoryAPIRequest();

  const onSendClue = useOnSubmitClueAPIRequest();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_CLUE}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          circleColor="pink"
        ></RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TurbanIcon />}
          title={translate('Concentração', 'Focus')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
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

        {/* Step 2 */}
        <ViewOr orCondition={isUserThePsychic}>
          <ViewOr orCondition={!state.currentCategoryId}>
            <StepCategorySelection
              currentCategories={state.currentCategories}
              onSendChosenSide={onSendChosenSide}
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
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDialClue;
