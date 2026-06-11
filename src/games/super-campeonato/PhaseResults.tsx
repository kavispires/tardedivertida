import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { TournamentIcon } from 'icons/TournamentIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { SUPER_CAMPEONATO_PHASES } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepWinner } from './StepWinner';

export function PhaseResults({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [previousTier, setPreviousTier] = useState<string>('');

  useEffect(() => {
    if (state.tier !== previousTier) {
      setPreviousTier(state.tier);
      setStep(0);
    }
  }, [state.tier, previousTier, setStep]);

  const announcement = (
    <PhaseAnnouncement
      icon={<TournamentIcon />}
      title={
        <Translate
          pt="Resultado!"
          en="Results!"
        />
      }
      type="overlay"
      currentRound={state?.round?.current}
      duration={3}
    >
      <Instruction>
        <Translate
          pt="Só pode haver um..."
          en="There's only one..."
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SUPER_CAMPEONATO_PHASES.RESULTS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepWinner
          brackets={state.brackets}
          challenge={state.challenge}
          bets={user.bets}
          goToNextStep={goToNextStep}
          selectedContenderIds={user.selectedContenderIds}
          announcement={announcement}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          isGameOver={false}
          round={state.round}
          brackets={state.brackets}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
