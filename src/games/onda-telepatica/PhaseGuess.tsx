// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { SoundWaveIcon } from 'icons/SoundWaveIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { StepGuess } from './StepGuess';
import { StepPsychicGuess } from './StepPsychicGuess';
import { NeedleChoice } from './components/NeedleChoice';
import { useUser } from 'hooks/useUser';

export function PhaseGuess({ players, state, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const user = useUser(players, state);
  const [, isUserThePsychic] = useWhichPlayerIsThe('psychicId', state, players);

  const onSendGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SoundWaveIcon />}
      title={<Translate pt="Adivinhação" en="Guessing" />}
      currentRound={state?.round?.current}
      duration={7}
      type="overlay"
    >
      <Instruction>
        <Translate pt="Você está sincronizado telepaticamente?" en="Are you telepathically in sync?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <NeedleChoice currentCategory={state.currentCategory} user={user} isPsychic={isUserThePsychic} />
          ),
        }}
      >
        {/* Step 0 */}
        <ViewOr condition={isUserThePsychic}>
          <StepPsychicGuess
            currentCategory={state.currentCategory}
            onSendGuess={onSendGuess}
            players={players}
            announcement={announcement}
          />
          <StepGuess
            currentCategory={state.currentCategory}
            onSendGuess={onSendGuess}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
