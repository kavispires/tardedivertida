// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import type { PhaseRevealState } from './utils/types';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';

export function PhaseReveal({ state, players }: PhaseProps<PhaseRevealState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [impostor] = useWhichPlayerIsThe('impostorId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<RankIcon />}
      title={
        <Translate
          pt="Revelação"
          en="Reveal"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Se o impostor recebeu 2 ou mais votos ele(a) é desmascarado. Quem votou nele ganha{' '}
              <PointsHighlight>3</PointsHighlight> pontos.
              <br />
              Se o impostor recebeu menos de 2 votos, ele ganha <PointsHighlight>5</PointsHighlight> pontos e
              o detetive líder ganha <PointsHighlight>4</PointsHighlight>
              pontos.
            </>
          }
          en={
            <>
              If the impostor gets 2 or more votes, they are exposed. Whoever voted for him get{' '}
              <PointsHighlight>3</PointsHighlight> points.
              <br />
              If the impostor gets fewer than 2 votes, he gets <PointsHighlight>5</PointsHighlight> points and
              the Lead detective gets <PointsHighlight>4</PointsHighlight>
              points.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.REVEAL}
      className="d-voting-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepReveal
          impostor={impostor}
          impostorVotes={state.impostorVotes}
          players={players}
          leaderId={state.leaderId}
          table={state.table}
          announcement={announcement}
          goToNextStep={goToNextStep}
        />

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
