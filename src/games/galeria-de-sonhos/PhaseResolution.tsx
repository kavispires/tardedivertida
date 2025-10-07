// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepRankingWrapper } from 'components/ranking';
import { StepSwitcher } from 'components/steps';
import { Instruction, RoundsLeftInstruction } from 'components/text';
// Internal
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
import { RowSwapInstruction } from './components/RulesBlobs';

export function PhaseResolution({ state, players }: PhaseProps) {
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={GALERIA_DE_SONHOS_PHASES.RESOLUTION}>
      <StepSwitcher step={step} players={players} waitingRoom={{ type: 'SERVER' }}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Ranking" en="Ranking" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
          duration={3}
        >
          <Instruction>
            <Translate pt="E quem deu mais matches foi..." en="And who matched the most was..." />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepRankingWrapper
          players={players}
          ranking={state.ranking}
          gainedPointsDescriptions={[
            <Translate
              key="1"
              pt="Pontos por encontrar só um jogador"
              en="Points for matching only 1 player"
            />,
            <Translate
              key="2"
              pt="Pontos por encontrar mais de um jogador"
              en="Points for matching with more players"
            />,
            <Translate
              key="3"
              pt="Pontos perdidos por não ter dado match e estar em um pesadelo"
              en="Points lost for not matching any player while in a nightmare"
            />,
          ]}
        >
          <RowSwapInstruction round={state.round} />
          <RoundsLeftInstruction round={state.round} />
          <HostNextPhaseButton round={state.round} />
        </StepRankingWrapper>
      </StepSwitcher>
    </PhaseContainer>
  );
}
