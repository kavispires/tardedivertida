import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { TournamentIcon } from 'icons/TournamentIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { StepRanking } from './StepRanking';
import { StepWinner } from './StepWinner';

export function PhaseResults({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [previousTier, setPreviousTier] = useState<string>('');
  const user = useUser(players, state);

  useEffect(() => {
    if (state.tier !== previousTier) {
      setPreviousTier(state.tier);
      setStep(0);
    }
  }, [state.tier, previousTier, setStep]);

  const announcement = (
    <PhaseAnnouncement
      icon={<TournamentIcon />}
      title={<Translate pt="Resultado!" en="Results!" />}
      type="overlay"
      currentRound={state?.round?.current}
      duration={3}
    >
      <Instruction>
        <Translate pt="Só pode haver um..." en="There's only one..." />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepWinner
          brackets={state.brackets}
          challenge={state.challenge}
          bets={user.bets}
          goToNextStep={goToNextStep}
          selectedContenderId={user.selectedContenderId}
          announcement={announcement}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          isGameOver={false}
          round={state.round}
          brackets={state.brackets}
          bets={user.bets}
          selectedContenderId={user.selectedContenderId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
