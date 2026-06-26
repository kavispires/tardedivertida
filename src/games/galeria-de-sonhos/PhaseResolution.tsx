// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { RankIcon } from '@icons/RankIcon';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { RoundsLeftInstruction } from '@components/text/RoundsLeftInstruction';
import { StepRankingWrapper } from '@components/wrappers/StepRankingWrapper';
// Internal
import { GALERIA_DE_SONHOS_PHASES } from './utils/constants';
import type { PhaseResolutionState } from './utils/types';
import { RowSwapInstruction } from './components/RulesBlobs';

export function PhaseResolution({ state, players }: PhaseProps<PhaseResolutionState>) {
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={GALERIA_DE_SONHOS_PHASES.RESOLUTION}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{ type: 'SERVER' }}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={
            <Translate
              pt="Ranking"
              en="Ranking"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
          duration={3}
        >
          <Surface>
            <Translate
              pt="E quem deu mais matches foi..."
              en="And who matched the most was..."
            />
          </Surface>
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
          {state.round.current < state.round.total && <RowSwapInstruction round={state.round} />}
          <RoundsLeftInstruction round={state.round} />
          <HostNextPhaseButton
            round={state.round}
            withWaitingTimeBar
          />
        </StepRankingWrapper>
      </StepSwitcher>
    </PhaseContainer>
  );
}
