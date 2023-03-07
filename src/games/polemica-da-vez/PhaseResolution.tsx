// Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ReviewIcon } from 'icons/ReviewIcon';
// Components
import { StepResolution } from './StepResolution';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepRanking } from './StepRanking';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { NOOP } from 'utils/constants';

function PhaseReact({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const announcement = (
    <PhaseAnnouncement
      icon={<ReviewIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      onClose={NOOP}
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
              So... did the topic trend?
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.POLEMICA_DA_VEZ.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResolution
          players={players}
          customTopic={state.customTopic}
          currentTopic={state.currentTopic}
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

export default PhaseReact;
