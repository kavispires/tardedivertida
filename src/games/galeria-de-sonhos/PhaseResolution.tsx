// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { RankIcon } from 'icons/RankIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Instruction, RoundsLeftInstruction } from 'components/text';
import { AdminNextPhaseButton } from 'components/admin';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.RESOLUTION}>
      <StepSwitcher
        step={step}
        conditions={[!user.isReady, !user.isReady, !user.isReady]}
        players={players}
        waitingRoomInstructionType="SERVER"
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<RankIcon />}
          title={<Translate pt="Ranking" en="Ranking" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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
          <RoundsLeftInstruction round={state.round} />
          <AdminNextPhaseButton round={state.round} />
        </StepRankingWrapper>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
