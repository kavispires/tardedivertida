// State & Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import {
  AdminNextRoundButton,
  ButtonContainer,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  Translate,
} from 'components';
import { StepReveal } from './StepReveal';
import { Button } from 'antd';
import { ScoringMessage } from './RulesBlobs';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, goToPreviousStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRIMES_HEDIONDOS.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Resultado', 'Results')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <ScoringMessage />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          user={user}
          groupedItems={state.groupedItems}
          items={state.items}
          players={players}
          scenes={state.scenes}
          scenesOrder={state.scenesOrder}
          crimes={state.crimes}
          onSeeRanking={goToNextStep}
          currentRound={state.round.current}
        />

        {/* Step 2 */}
        <Step fullWidth>
          <Title>Ranking</Title>

          <RankingBoard ranking={state.ranking} players={players} />

          <ButtonContainer>
            <Button onClick={goToPreviousStep}>
              <Translate pt="Ver resultado novamente" en="See results again" />
            </Button>
          </ButtonContainer>
          <AdminNextRoundButton round={state.round} lastRound={state?.lastRound} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseReveal;
