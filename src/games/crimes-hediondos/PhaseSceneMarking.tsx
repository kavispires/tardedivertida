import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CRIMES_HEDIONDOS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import { StepNewScene } from './StepNewScene';

function PhaseSceneMarking({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  const onSubmitSceneMarkingAPIRequest = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-mark',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Respostas enviadas com sucesso', 'Guesses submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to send your guesses',
      language
    ),
  });

  const onSubmitMark = (payload: PlainObject) => {
    onSubmitSceneMarkingAPIRequest({
      action: 'SUBMIT_MARK',
      ...payload,
    });
  };

  const increaseStep = () => setStep((s: number) => ++s);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.SCENE_MARKING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={increaseStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="loupe"
          title={translate('Nova pista', 'New clue', language)}
          onClose={increaseStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              en="Compartilhe mais uma pista sobre seu crime:"
              pt="Share one more piece of information about your crime:"
            />
            <br />
            {state.currentScene.description[language]}
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepNewScene
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          onSubmitMark={onSubmitMark}
          sceneTile={state.currentScene}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseSceneMarking;
