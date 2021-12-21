import PropTypes from 'prop-types';
import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RankingBoard,
  Step,
  StepSwitcher,
  Title,
  translate,
  Translate,
} from '../../components/shared';
import { AdminForceNextPhase } from '../../components/admin';
import StepReveal from './StepReveal';

function PhaseReveal({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const language = useLanguage();
  const user = useUser(players);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.REVEAL}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="rank"
          title={translate('Resultado', 'Results', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Você ganha 2 pontos para cada célula com uma resposta correta sua.
                  <br />
                  + 1 ponto para cada célula com uma dica mas uma resposta errada sua.
                  <br />
                  + 1 ponto para cada voto correto que sua dica recebeu.
                  <br />
                  Mas se ninguém acertar sua dica, você perde {Object.keys(players).length} pontos.
                </>
              }
              en={
                <>
                  You get 2 points for each cell with your correct answer.
                  <br />
                  + 1 point for each cell with a clue but with a wrong answer of yours.
                  <br />
                  + 1 point for each correct vote your clue received.
                  <br />
                  But if nobody gets your clue correctly, you lose ${Object.keys(players).length} points.
                </>
              }
            />
          </Instruction>
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

          <RankingBoard ranking={state.ranking} players={players} />
          <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseReveal.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    clues: PropTypes.any,
    grid: PropTypes.any,
    phase: PropTypes.string,
    ranking: PropTypes.any,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
    whoGotNoPoints: PropTypes.array,
  }),
};

export default PhaseReveal;
