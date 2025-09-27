// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { ChoiceIcon } from 'icons/ChoiceIcon';
import { MirrorIcon } from 'icons/MirrorIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPromptAPIRequest } from './utils/api-requests';
import { SLIDE_DURATION, TA_NA_CARA_PHASES } from './utils/constants';
import type { PhasePromptingState, PhaseRevealState } from './utils/types';
import { StepSelectPrompt } from './StepSelectPrompt';
import { StepWaitForPrompt } from './StepWaitForPrompt';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';

export function PhaseReveal({ meta, players, state }: PhaseProps<PhaseRevealState>) {
  const user = useUser(players, state);
  const { step, goToPreviousStep, goToNextStep } = useStep(0);

  const slideShowConfig = useSlideShow({
    length: state.gallery.length,
    slideDuration: SLIDE_DURATION,
    onExpire: goToNextStep,
  });

  const onGoBack = () => {
    slideShowConfig.reset();
    goToPreviousStep();
  };

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<MirrorIcon />}
          title={<Translate pt="Resultados" en="Results" />}
          currentRound={state?.round?.current}
          type="block"
          unskippable
          duration={state.round.current === 1 ? 7 : 3}
          onClose={goToNextStep}
        >
          <Instruction>
            <Translate
              pt="São 5 pontos por identidades corretas e 2 pontos por jogadores que identificaram você corretamente"
              en="5 points for correct identities and 2 points for players who identified you correctly"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepGallery
          players={players}
          user={user}
          identitiesDict={state.identitiesDict}
          questionsDict={state.questionsDict}
          gallery={state.gallery}
          slideShowConfig={slideShowConfig}
        />

        {/* Step 2 */}
        <StepRanking players={players} ranking={state.ranking} round={state.round} onGoBack={onGoBack} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
