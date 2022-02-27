import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe } from '../../hooks';
import { useOnSubmitCategoryAPIRequest, useOnSubmitClueAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  ViewOr,
} from '../../components';
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';

function PhaseDialClue({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const [step, setStep] = useState(0);
  const [psychic, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendChosenSide = useOnSubmitCategoryAPIRequest();

  const onSendClue = useOnSubmitClueAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_CLUE}
      className="o-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={() => setStep(1)}
          time={5}
          circleColor="pink"
        ></RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="turban"
          title={translate('Concentração', 'Focus')}
          onClose={() => setStep(2)}
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
