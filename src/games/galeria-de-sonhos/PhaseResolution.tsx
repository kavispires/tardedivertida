// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Utils
import { PHASES } from 'utils/phases';
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
import { RowSwapInstruction } from './components/RulesBlobs';

export function PhaseResolution({ players, state }: PhaseProps) {
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.RESOLUTION}>
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
            <Translate pt="Pontos por encontrar só um jogador" en="Points for matching only 1 player" />,
            <Translate
              pt="Pontos por encontrar mais de um jogador"
              en="Points for matching with more players"
            />,
            <Translate
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
