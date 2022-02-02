import { useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitVotesAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from '../../components';
import { DreamBoard } from './DreamBoard';
import { StepMatchDreams } from './StepMatchDreams';

function PhaseMatch({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.MATCH}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady]}
        players={players}
        waitingRoomContent={<DreamBoard user={user} table={state.table} />}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Selecione os pares', 'Match the dreams')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Selecione os pares de dica e carta.
                  <br />
                  Se você acertas todas, você ganha o jogo.
                  <br />
                  Dica: Seus pesadelos podem ser o sonho de outra pessoa.
                </>
              }
              en={
                <>
                  Match the pairs of cards and clues.
                  <br />
                  If you match all of them correctly, you win the game.
                  <br />
                  Hint: Your nightmares may be the dream of another player.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepMatchDreams
          players={players}
          user={user}
          table={state.table}
          onSubmitVotes={onSubmitVotes}
          dreamsCount={state.dreamsCount}
          clues={state.clues}
          currentRound={state?.round?.current}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseMatch;
