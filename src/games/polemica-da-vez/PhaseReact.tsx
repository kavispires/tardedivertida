// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
import { useStep } from '@hooks/useStep';
// Icons
import { FeedbackIcon } from '@icons/FeedbackIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitReactionAPIRequest } from './utils/api-requests';
import { mockGuess } from './utils/mock';
import { POLEMICA_DA_VEZ_PHASES } from './utils/constants';
import type { PhaseReactState } from './utils/types';
import { StepLiking } from './StepLiking';

export function PhaseReact({ state, players }: PhaseProps<PhaseReactState>) {
  const { step, setStep } = useStep(0);

  const onSubmitReaction = useOnSubmitReactionAPIRequest(setStep);

  useMock(() => {
    onSubmitReaction(mockGuess(Object.keys(players).length));
  }, []);

  const announcement = (
    <PhaseAnnouncement
      icon={<FeedbackIcon />}
      title={
        <Translate
          pt="O que você acha?"
          en="What do you think?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt={
            <>
              Um assunto polêmico está abalando as redes sociais!
              <br />
              Curta (ou não) e tente descobrir quantas curtidas ele vai receber.
            </>
          }
          en={
            <>
              A topic is trending in all social media!
              <br />
              Like (or not) and try to guess how many likes it will get!
            </>
          }
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={POLEMICA_DA_VEZ_PHASES.REACT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepLiking
          currentTweet={state.currentTweet}
          customTweet={state.customTweet}
          onSubmitReaction={onSubmitReaction}
          players={players}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
