// State & Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitMarkAPIRequest } from './utils/api-requests';
import { mockSceneMark } from './utils/mock';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { LoupeIcon } from 'icons/LoupeIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { RoundAnnouncement } from 'components/round';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
import { StepNewScene } from './StepNewScene';

export function PhaseSceneMarking({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep(0);

  const onSubmitMark = useOnSubmitMarkAPIRequest(setStep);

  useMock(() => {
    onSubmitMark({ sceneIndex: mockSceneMark() });
  }, []);

  const announcement = (
    <PhaseAnnouncement
      icon={<LoupeIcon />}
      title={<Translate pt="Nova pista" en="New clue" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Compartilhe mais uma pista sobre seu crime:"
          en="Share one more piece of information about your crime:"
        />
        <br />
        <TextHighlight>
          <DualTranslate>{state.currentScene.description}</DualTranslate>
        </TextHighlight>
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.SCENE_MARKING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <StepNewScene
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          onSubmitMark={onSubmitMark}
          sceneTile={state.currentScene}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
