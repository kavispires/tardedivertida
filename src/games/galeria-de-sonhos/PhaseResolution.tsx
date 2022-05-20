// State & Hooks
import { useIsUserReady, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Instruction } from 'components/text';
import { AdminNextRoundButton } from 'components/admin';

function PhaseResolution({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.GALERIA_DE_SONHOS.RESOLUTION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady, !isUserReady, !isUserReady]}
        players={players}
        waitingRoomInstructionType="SERVER"
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Ranking', 'Ranking')}
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
          <AdminNextRoundButton round={state.round} lastRound={state.isLastRound} />
        </StepRankingWrapper>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
