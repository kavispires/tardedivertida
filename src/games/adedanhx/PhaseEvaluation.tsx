import { useMemo } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { VerifyListIcon } from '@icons/VerifyListIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitEvaluationsAPIRequest } from './utils/api-requests';
import { ADEDANHX_PHASES } from './utils/constants';
import type { PhaseEvaluationState } from './utils/types';
import { ScoringRule } from './components/RulesBlobs';
import { StepEvaluateGroup } from './StepEvaluateGroup';
import { StepEvaluationComplete } from './StepEvaluationComplete';

export function PhaseEvaluation({ players, state, user }: PhaseProps<PhaseEvaluationState>) {
  const { step } = useStep();

  const onSubmitCurrentEvaluations = useOnSubmitEvaluationsAPIRequest();

  const answersGroupIndex = useMemo(() => {
    // The answersGroupIndex is always the first answersGroups where not all players have evaluated every entry
    const currentGroupIndex = state.answersGroups.findIndex((group) => {
      const hasUnevaluatedEntries = group.answers.some((answer) => {
        const hasBeenEvaluatedByAllPlayers = Object.values(players).every((player) => {
          return player.evaluations[answer.id] !== undefined;
        });

        return !hasBeenEvaluatedByAllPlayers;
      });

      return hasUnevaluatedEntries;
    });

    return currentGroupIndex;
  }, [players, state.answersGroups]);

  const announcement = (
    <PhaseAnnouncement
      icon={<VerifyListIcon />}
      title={
        <Translate
          pt="Avaliação"
          en="Evaluation"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={10}
    >
      <Surface>
        <Translate
          pt={
            <>
              Vamos conferir cada resposta!
              <br />
            </>
          }
          en={
            <>
              Let's check each answer!
              <br />
            </>
          }
        />
        <ScoringRule />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ADEDANHX_PHASES.EVALUATION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        {answersGroupIndex > -1 ? (
          <StepEvaluateGroup
            players={players}
            user={user}
            announcement={announcement}
            answersGroups={state.answersGroups}
            answersGroupIndex={answersGroupIndex}
            onSubmitCurrentEvaluations={onSubmitCurrentEvaluations}
          />
        ) : (
          <StepEvaluationComplete />
        )}
      </StepSwitcher>
    </PhaseContainer>
  );
}
