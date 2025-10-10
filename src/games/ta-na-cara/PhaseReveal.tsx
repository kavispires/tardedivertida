// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSlideShow } from 'hooks/useSlideShow';
import { useStep } from 'hooks/useStep';
// Icons
import { MirrorIcon } from 'icons/MirrorIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { SLIDE_DURATION, TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseRevealState } from './utils/types';
import { StepRanking } from './StepRanking';
import { StepGallery } from './StepGallery';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

export function PhaseReveal({ players, state, user }: PhaseProps<PhaseRevealState>) {
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
              pt={
                <>
                  São <PointsHighlight>5 pontos</PointsHighlight> por identidades corretas e{' '}
                  <PointsHighlight>2 pontos</PointsHighlight> por jogadores que identificaram você
                  corretamente
                </>
              }
              en={
                <>
                  It's <PointsHighlight>5 points</PointsHighlight> for correct identities and{' '}
                  <PointsHighlight>2 points</PointsHighlight> for players who identified you correctly
                </>
              }
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
