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
  Step,
  StepSwitcher,
  translate,
  Translate,
  ViewIf,
} from '../../components';
import { StepClueWriting } from './StepClueWriting';
import { StepClueWaiting } from './StepClueWaiting';
import { StepCategorySelection } from './StepCategorySelection';

function PhaseDialClue({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
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
        ></RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="turban"
          title={translate('Concentração', 'Focus', language)}
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
        <Step fullWidth>
          <ViewIf isVisible={isUserThePsychic && !state.currentCategoryId}>
            <StepCategorySelection
              currentCategories={state.currentCategories}
              onSendChosenSide={onSendChosenSide}
            />
          </ViewIf>

          <ViewIf isVisible={isUserThePsychic && state.currentCategoryId}>
            <StepClueWriting
              currentCategories={state.currentCategories}
              currentCategoryId={state.currentCategoryId}
              target={state.target}
              onSendClue={onSendClue}
            />
          </ViewIf>

          <ViewIf isVisible={!isUserThePsychic}>
            <StepClueWaiting
              players={players}
              psychic={psychic}
              currentCategories={state.currentCategories}
              currentCategoryId={state.currentCategoryId}
            />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseDialClue;
