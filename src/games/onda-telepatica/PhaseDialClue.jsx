import PropTypes from 'prop-types';
import React, { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useLanguage, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  DefaultWaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  translate,
  Translate,
  ViewIf,
} from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import StepClueWriting from './StepClueWriting';
import StepClueWaiting from './StepClueWaiting';
import StepCategorySelection from './StepCategorySelection';

function PhaseDialClue({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const [step, setStep] = useState(0);
  const [psychic, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSubmitCategoryRequest = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-category',
    successMessage: translate('Categoria enviada com sucesso!', 'Category submitted successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria',
      'Oops, the application failed to submit the category',
      language
    ),
  });

  const onSubmitClueRequest = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dica enviado com sucesso!', 'Clue submitted successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua dica',
      'Oops, the application failed to submit your clue',
      language
    ),
  });

  const onSendChosenSide = (payload) => {
    onSubmitCategoryRequest({
      action: 'SUBMIT_CATEGORY',
      ...payload,
    });
  };

  const onSendClue = (payload) => {
    onSubmitClueRequest({
      action: 'SUBMIT_CLUE',
      ...payload,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_CLUE}
      className="o-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
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

        {/* Step 3 */}
        <Step fullWidth>
          <DefaultWaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseDialClue.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    currentCategories: PropTypes.array,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    target: PropTypes.number,
  }),
};

export default PhaseDialClue;
