// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitStoryAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components

import { StoryWaiting } from './StoryWaiting';
import { StoryWriting } from './StoryWriting';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { TurnOrder } from 'components/players';
import { ImageCardPreloadHand } from 'components/cards';
import { ViewOr } from 'components/views';

function PhaseStory({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onSubmitStory = useOnSubmitStoryAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.STORY}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={5} circleColor="purple" />

        {/* Step 1 */}
        <PhaseAnnouncement
          type="fairy-tale"
          title={translate('Conte-nos uma história', 'Tell us a story...')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          buttonText=""
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Para essa rodada, <AvatarName player={storyteller} addressUser size="small" /> será o(a)
                  Contador(a) de Histórias.
                </>
              }
              en={
                <>
                  For this round, <AvatarName player={storyteller} addressUser /> will be the Storyteller.
                </>
              }
            />
            <TurnOrder players={players} order={state.gameOrder} activePlayerId={state.storytellerId} />
            <ImageCardPreloadHand hand={user?.hand} />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <ViewOr orCondition={isUserTheStoryTeller}>
          <StoryWriting user={user} onSubmitStory={onSubmitStory} />
          <StoryWaiting user={user} storyteller={storyteller} players={players} gameOrder={state.gameOrder} />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseStory;
