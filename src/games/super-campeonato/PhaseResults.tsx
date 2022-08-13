import { useEffect, useState } from 'react';
// Hooks
import { useLanguage, useStep, useUser } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { TournamentIcon } from 'components/icons/TournamentIcon';
import { StepRanking } from './StepRanking';
import { StepWinner } from './StepWinner';

function PhaseResults({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [previousTier, setPreviousTier] = useState<string>('');
  const user = useUser(players);

  useEffect(() => {
    if (state.tier !== previousTier) {
      setPreviousTier(state.tier);
      setStep(0);
    }
  }, [state.tier, previousTier, setStep]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TournamentIcon />}
          title={translate('Resultado!', 'Resultado!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Só pode haver um..." en="There's only one..." />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepWinner
          brackets={state.brackets}
          challenge={state.challenge}
          bets={user.bets}
          goToNextStep={goToNextStep}
          selectedContenderId={user.selectedContenderId}
        />

        {/* Step 2 */}
        <StepRanking
          players={players}
          ranking={state.ranking}
          isGameOver={false}
          round={state.round}
          brackets={state.brackets}
          isLastRound={state?.lastRound}
          bets={user.bets}
          selectedContenderId={user.selectedContenderId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResults;
