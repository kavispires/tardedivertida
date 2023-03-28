// Hooks
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
import { useOnSubmitReactionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { mockGuess } from './utils/mock';
// Icons
import { FeedbackIcon } from 'icons/FeedbackIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepLiking } from './StepLiking';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseReact({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);

  const onSubmitReaction = useOnSubmitReactionAPIRequest(setStep);

  useMock(() => {
    onSubmitReaction(mockGuess(Object.keys(players).length));
  }, []);

  const announcement = (
    <PhaseAnnouncement
      icon={<FeedbackIcon />}
      title={<Translate pt="O que você acha?" en="What do you think?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
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
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.REACT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepLiking
          currentTopic={state.currentTopic}
          customTopic={state.customTopic}
          onSubmitReaction={onSubmitReaction}
          players={players}
          announcement={announcement}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReact;
