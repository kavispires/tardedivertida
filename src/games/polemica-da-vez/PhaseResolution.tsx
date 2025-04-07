// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { ReviewIcon } from 'icons/ReviewIcon';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { POLEMICA_DA_VEZ_PHASES } from './utils/constants';
import { StepResolution } from './StepResolution';
import { StepRanking } from './StepRanking';

export function PhaseResolution({ state, players }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const announcement = (
    <PhaseAnnouncement
      icon={<ReviewIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              E aí? Será que o assunto bombou?
              <br />
              Se você acertou a quantidade de curtidas, você ganha <PointsHighlight>3</PointsHighlight>{' '}
              pontos.
              <br />
              Se você quase acertou, você ganha <PointsHighlight>1</PointsHighlight> ponto.
            </>
          }
          en={
            <>
              So... did the tweet trend?
              <br />
              If you guessed the correct number of likes, you get <PointsHighlight>3</PointsHighlight> points.
              <br />
              If you were one off, you get <PointsHighlight>1</PointsHighlight> point.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={POLEMICA_DA_VEZ_PHASES.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResolution
          players={players}
          customTweet={state.customTweet}
          currentTweet={state.currentTweet}
          totalLikes={state.totalLikes}
          goToNextStep={goToNextStep}
          announcement={announcement}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
