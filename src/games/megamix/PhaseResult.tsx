import { useEffect, useState } from 'react';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useColorizeBackground } from './utils/useColorizeBackground';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { BouncerIcon } from 'icons/BouncerIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepResult } from './StepResult';
import { StepRanking } from './StepRanking';

export function PhaseResult({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [isFirstRunThrough, setIsFirstRunThrough] = useState(true);

  // Changes isFirstGalleryRunThrough property which disables controls, after the first gallery run through
  useEffect(() => {
    if (isFirstRunThrough && step > 0) {
      setIsFirstRunThrough(false);
    }
  }, [step, isFirstRunThrough]);

  // Dynamic background
  useColorizeBackground(user, state?.round?.current);

  const announcement = (
    <PhaseAnnouncement
      icon={<BouncerIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt="Quem vai pra área VIP?" en="So who goes to the VIP area?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MEGAMIX.RESULT}>
      <StepSwitcher step={step} players={players}>
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
