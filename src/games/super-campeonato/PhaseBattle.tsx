import { useEffect, useState } from 'react';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { BoxingGlovesIcon } from 'icons/BoxingGlovesIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepBattle } from './StepBattle';

function PhaseBattle({ state, players, info }: PhaseProps) {
  const { step, setStep } = useStep(0);
  const [previousTier, setPreviousTier] = useState<string>('');
  const user = useUser(players, state);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  useEffect(() => {
    if (state.tier !== previousTier) {
      setPreviousTier(state.tier);
      setStep(0);
    }
  }, [state.tier, previousTier, setStep]);

  const announcement = (
    <PhaseAnnouncement
      icon={<BoxingGlovesIcon />}
      title={<Translate pt="Batalha!" en="Battle!" />}
      type="overlay"
      currentRound={state?.round?.current}
      duration={3}
    >
      <Instruction>
        <Translate
          pt="Vote em quem você acha que melhor se encaixa no desafio"
          en="Vote on who you think best fit the challenge"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.BATTLE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepBattle
          onSubmitVotes={onSubmitVotes}
          challenge={state.challenge}
          brackets={state.brackets}
          tier={state.tier}
          bets={user.bets}
          selectedContenderId={user.selectedContenderId}
          players={players}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBattle;
