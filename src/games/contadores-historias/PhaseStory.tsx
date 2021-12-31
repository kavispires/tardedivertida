import { useState } from 'react';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { CONTADORES_HISTORIAS_API } from '../../adapters';
import { PHASES } from '../../utils/phases';
// Components
import {
  AvatarName,
  ImageCardPreloadHand,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
  WaitingRoom,
} from '../../components';
import StoryWaiting from './StoryWaiting';
import StoryWriting from './StoryWriting';

function PhaseStory({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);
  const [nextStoryteller] = useWhichPlayerIsThe('nextStorytellerId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitStory = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'submit-story',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('História submetida com sucesso', 'Story submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua história',
      'Oops, the application found an error while trying to submit your story',
      language
    ),
  });

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.STORY}>
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={5} />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="fairy-tale"
          title={translate('Conte-nos uma história', 'Tell us a story...', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          buttonText=""
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Para essa rodada, <AvatarName player={storyteller} addressUser size="small" /> será o(a)
                  Contador(a) de Histórias.
                  <br />
                  Para a próxima rodada, será: {nextStoryteller.name}
                </>
              }
              en={
                <>
                  For this round, <AvatarName player={storyteller} addressUser /> will be the Storyteller.
                  <br />
                  For the next round we will have: {nextStoryteller.name}
                </>
              }
            />
            <ImageCardPreloadHand hand={user?.hand} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={!isUserTheStoryTeller}>
            <StoryWaiting user={user} storyteller={storyteller} />
          </ViewIf>

          <ViewIf isVisible={isUserTheStoryTeller}>
            <StoryWriting user={user} onSubmitStory={onSubmitStory} />
          </ViewIf>
        </Step>

        {/* Step 3 */}
        <WaitingRoom
          players={players}
          title={translate('Pronto!', 'Done!', language)}
          instruction={translate(
            'Aguardando o servidor dar sinal de vida',
            'Waiting for the server to resuscitate',
            language
          )}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseStory;
