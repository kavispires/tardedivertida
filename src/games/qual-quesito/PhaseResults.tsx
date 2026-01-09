// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { RankIcon } from 'icons/collection';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseResultsState } from './utils/types';
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { StepResults } from './StepResults';
import { StepRanking } from './StepRanking';

export function PhaseResults({ players, state, user }: PhaseProps<PhaseResultsState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [creator] = useWhichPlayerIsThe('creatorId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<RankIcon />}
      title={
        <Translate
          pt="Resultado"
          en="Results"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>
        <Translate
          pt="Cada coisa cabe ao quesito ou não? Avalie honestamente!"
          en="Does each thing fit the category or not? Evaluate honestly!"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUAL_QUESITO_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResults
          players={players}
          user={user}
          cardsDict={state.cardsDict}
          category={state.category}
          goToNextStep={goToNextStep}
          creator={creator}
          table={state.table}
          announcement={announcement}
          creatorBonus={state.creatorBonus}
          turnOrder={state.turnOrder}
        />

        <StepRanking
          ranking={state.ranking}
          players={players}
          goToPreviousStep={goToPreviousStep}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
