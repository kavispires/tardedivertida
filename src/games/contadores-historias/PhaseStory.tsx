// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { FairyTaleIcon } from 'icons/FairyTaleIcon';
// Components
import { AvatarName } from 'components/avatars';
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitStoryAPIRequest } from './utils/api-requests';
import { StoryWaiting } from './components/StoryWaiting';
import { StoryWriting } from './components/StoryWriting';

export function PhaseStory({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const [storyteller, isUserTheStoryTeller] = useWhichPlayerIsThe('storytellerId', state, players);

  const onSubmitStory = useOnSubmitStoryAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<FairyTaleIcon />}
      title={<Translate pt="Conte-nos uma história" en="Tell us a story..." />}
      currentRound={state?.round?.current}
      type="overlay"
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
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CONTADORES_HISTORIAS.STORY}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <ViewOr condition={isUserTheStoryTeller}>
          <StoryWriting user={user} onSubmitStory={onSubmitStory} announcement={announcement} />
          <StoryWaiting
            user={user}
            storyteller={storyteller}
            players={players}
            gameOrder={state.gameOrder}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
