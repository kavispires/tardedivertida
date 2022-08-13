// Ant Design Resources
import { Button, Space } from 'antd';
// State & Hooks
import { useIsUserReady, useLanguage, useStep, useWhichPlayerIsThe } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Step, StepSwitcher } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { RankingBoard } from 'components/ranking';
import { AdminNextPhaseButton } from 'components/admin';
import { StepReveal } from './StepReveal';
import { ScoringRules } from './components/RulesBlobs';
import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const [psychic] = useWhichPlayerIsThe('psychicId', state, players);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.ONDA_TELEPATICA.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<WavelengthDeviceIcon />}
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={7}
        >
          <Instruction>
            <Translate pt="Hora de contar os pontos!" en="Time to score!" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          players={players}
          psychic={psychic}
          currentCategory={state.currentCategory}
          goToNextStep={goToNextStep}
        />

        {/* Step 2 */}
        <Step fullWidth>
          <Title>Ranking</Title>

          <PopoverRule
            label={<Translate pt="Como a pontuação funciona?" en="How does scoring work?" />}
            content={<ScoringRules />}
          />

          <RankingBoard ranking={state.ranking} players={players} />
          <Space className="space-container" align="center">
            <Button onClick={goToPreviousStep}>
              <Translate pt="Ver resultado novamente" en="See results again" />
            </Button>
          </Space>
          <AdminNextPhaseButton round={state.round} lastRound={state?.lastRound} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
