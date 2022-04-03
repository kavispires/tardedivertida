// State & Hooks
import { useUser, useLanguage, useMock, useStep } from 'hooks';
import { useOnSubmitMarkAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockSceneMark } from './mock';
// Components
import { Instruction, RoundAnnouncement, StepSwitcher, Translate } from 'components';
import { StepNewScene } from './StepNewScene';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseSceneMarking({ players, state, info }: PhaseProps) {
  const { language, translate } = useLanguage();
  const user = useUser(players);
  const { step, setStep, goToNextStep } = useStep(0);

  const onSubmitMark = useOnSubmitMarkAPIRequest(setStep);

  useMock(() => {
    onSubmitMark({ sceneIndex: mockSceneMark() });
  }, []);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.SCENE_MARKING}>
      <StepSwitcher step={step} conditions={[!user.ready, !user.ready, !user.ready]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state?.round} onPressButton={goToNextStep} buttonText=" " time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="loupe"
          title={translate('Nova pista', 'New clue')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt="Compartilhe mais uma pista sobre seu crime:"
              en="Share one more piece of information about your crime:"
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
