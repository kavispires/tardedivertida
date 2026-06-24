// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
import { useStep } from '@hooks/useStep';
// Icons
import { LoupeIcon } from '@icons/LoupeIcon';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import { useOnSubmitMarkAPIRequest } from './utils/api-requests';
import { mockSceneMark } from './utils/mock';
import type { PhaseSceneMarkingState } from './utils/types';
import { useGameTypes } from './utils/hooks';
import { CRIMES_HEDIONDOS_PHASES } from './utils/constants';
import { StepNewScene } from './StepNewScene';

export function PhaseSceneMarking({ players, state, user }: PhaseProps<PhaseSceneMarkingState>) {
  const { step, setStep, goToNextStep } = useStep(0);

  const onSubmitMark = useOnSubmitMarkAPIRequest(setStep);
  const { isLocationGame, isVictimGame } = useGameTypes(state.items);

  useMock(() => {
    onSubmitMark({ sceneIndex: mockSceneMark() });
  }, []);

  const announcement = (
    <PhaseAnnouncement
      icon={<LoupeIcon />}
      title={
        <Translate
          pt="Nova pista"
          en="New clue"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Compartilhe mais uma pista sobre seu crime:"
          en="Share one more piece of information about your crime:"
        />
        <br />
        <TextHighlight>
          <DualTranslate>{state.currentScene.description}</DualTranslate>
        </TextHighlight>
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CRIMES_HEDIONDOS_PHASES.SCENE_MARKING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
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
          isVictimGame={isVictimGame}
          isLocationGame={isLocationGame}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
