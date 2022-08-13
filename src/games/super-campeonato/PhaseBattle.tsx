import { useEffect, useState } from 'react';
// Hooks
import { useLanguage, useStep, useUser } from 'hooks';
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { BoxingGlovesIcon } from 'components/icons/BoxingGlovesIcon';
import { StepBattle } from './StepBattle';

function PhaseBattle({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [previousTier, setPreviousTier] = useState<string>('');
  const user = useUser(players);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  useEffect(() => {
    if (state.tier !== previousTier) {
      setPreviousTier(state.tier);
      setStep(0);
    }
  }, [state.tier, previousTier, setStep]);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.BATTLE}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<BoxingGlovesIcon />}
          title={translate('Batalha!', 'Battle!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate
              pt="Vote em quem você acha que melhor se encaixa no desafio"
              en="Vote on who you think best fit the challenge"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepBattle
          onSubmitVotes={onSubmitVotes}
          challenge={state.challenge}
          brackets={state.brackets}
          tier={state.tier}
          bets={user.bets}
          selectedContenderId={user.selectedContenderId}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBattle;
