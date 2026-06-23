import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { BouncerIcon } from '@icons/BouncerIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { Instruction } from '@components/text/Instruction';
// Internal
import { MEGAMIX_PHASES } from './utils/constants';
import { StepResult } from './StepResult';
import { StepRanking } from './StepRanking';

export function PhaseResult({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [isFirstRunThrough, setIsFirstRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstRunThrough && step > 0) {
      setIsFirstRunThrough(false);
    }
  }, [step, isFirstRunThrough]);

  const announcement = (
    <PhaseAnnouncement
      icon={<BouncerIcon />}
      title={
        <Translate
          pt="Resultado"
          en="Results"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate
          pt="Quem vai pra área VIP?"
          en="So who goes to the VIP area?"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MEGAMIX_PHASES.RESULT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResult
          players={players}
          announcement={announcement}
          onSeeRanking={goToNextStep}
          user={user}
          round={state.round}
          isFirstRunThrough={isFirstRunThrough}
          track={state.track}
          winningValues={state.winningValues}
          winningTeam={state.winningTeam}
          scoringType={state.scoringType}
        />

        {/* Step 1 */}
        <StepRanking
          ranking={state.ranking}
          players={players}
          goToPreviousStep={goToPreviousStep}
          round={state.round}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
