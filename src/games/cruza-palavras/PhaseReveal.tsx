import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  AdminNextRoundButton,
  ButtonContainer,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  PopoverRule,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  translate,
  Translate,
} from '../../components';
import StepReveal from './StepReveal';
import { Button } from 'antd';
import { ScoringRule } from './RulesBlobs';

function PhaseReveal({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);
  const playerCount = Object.keys(players).length;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Resultado', 'Results', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <ScoringRule playerCount={playerCount} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepReveal
          user={user}
          grid={state.grid}
          clues={state.clues}
          nextStep={() => setStep(2)}
          players={players}
          whoGotNoPoints={state.whoGotNoPoints ?? []}
        />

        {/* Step 2 */}
        <Step fullWidth>
          <Title>Ranking</Title>
          <Instruction contained>
            <Translate
              pt="Distribuição de pontos: Votos corretos | Votos recebidos | Penalidade se ninguém acertou a sua dica"
              en="Points Distribution: Correct guesses | Received votes | Penalty for nobody getting your clue correctly"
            />
          </Instruction>

          <PopoverRule content={<ScoringRule playerCount={playerCount} />} />

          <RankingBoard ranking={state.ranking} players={players} />

          <ButtonContainer>
            <Button onClick={() => setStep(1)}>
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
