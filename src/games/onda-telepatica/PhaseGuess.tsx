import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { SoundWaveIcon } from '@icons/SoundWaveIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { ONDA_TELEPATICA_PHASES } from './utils/constants';
import type { PhaseGuessState } from './utils/types';
import { NeedleChoice } from './components/NeedleChoice';
import { StepGuess } from './StepGuess';
import { StepPsychicGuess } from './StepPsychicGuess';

export function PhaseGuess({ state, players, user }: PhaseProps<PhaseGuessState>) {
  const { step, setStep } = useStep(0);

  const [, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SoundWaveIcon />}
      title={
        <Translate
          pt="Adivinhação"
          en="Guessing"
        />
      }
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Você está sincronizado telepaticamente?"
          en="Are you telepathically in sync?"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ONDA_TELEPATICA_PHASES.GUESS}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <NeedleChoice
              currentCategory={state.currentCategory}
              user={user}
              isPsychic={isUserThePsychic}
            />
          ),
        }}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserThePsychic}>
            <StepPsychicGuess
              currentCategory={state.currentCategory}
              onSendGuess={onSendGuess}
              announcement={announcement}
            />
          </ViewIf>
          <ViewIf condition={!isUserThePsychic}>
            <StepGuess
              currentCategory={state.currentCategory}
              onSendGuess={onSendGuess}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
