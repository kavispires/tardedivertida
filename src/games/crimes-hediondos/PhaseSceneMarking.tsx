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
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import { GuessMessage } from './RulesBlobs';
import { StepItemsSelection } from './StepItemsSelection';

function PhaseSceneMarking({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<PlainObject>({});

  const onSubmitSceneMarkingAPIRequest = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-mark',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso', 'Guesses submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to send your guesses',
      language
    ),
  });

  const onSubmitMark = () => {
    onSubmitSceneMarkingAPIRequest({
      action: 'SUBMIT_MARK',
      ...selections,
    });
  };

  const increaseStep = () => setStep((s: number) => ++s);

  const updateSelections = (payload: PlainObject) => {
    setSelections((s: PlainObject) => ({ ...s, ...payload }));
    increaseStep();
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.SCENE_MARKING}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstruction={translate(
          'Vamos aguardar enquanto os outros jogadores terminam!',
          'Please wait while other players finish!',
          language
        )}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="multitask"
          title={translate('Nova pista', 'New clue', language)}
          onClose={increaseStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              en="Compartilhe mais uma pista sobre seu crime"
              pt="Share one more piece of information about your crime"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        {/* <Step
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          selections={selections}
          updateSelections={updateSelections}
        /> */}
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseSceneMarking;
