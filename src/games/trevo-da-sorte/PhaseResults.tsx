// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';

import { useStep } from 'hooks/useStep';

// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepRanking } from './StepRanking';
import { RankIcon } from 'components/icons/RankIcon';

function PhaseResults({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.RESULTS}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate pt="Quantos pontos você ganhou?" en="How many points did you get?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          clover={state.clover}
          leaves={state.leaves}
          ranking={state.ranking}
          lastRound={state.lastRound}
          activeCloverId={state.activeCloverId}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResults;
