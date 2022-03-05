import { useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, PhaseAnnouncement, PhaseContainer, StepSwitcher, Translate } from 'components';
import { DreamBoard } from './DreamBoard';
import { StepResults } from './StepResults';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.RESOLUTION}>
      <StepSwitcher
        step={step}
        conditions={[!isUserReady]}
        players={players}
        waitingRoomContent={<DreamBoard user={user} table={state.table} />}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          type="countdown"
          title={translate('Resultado', 'Results')}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  E aí, como você se saiu?
                  <br />
                  Você ganha o jogo se tiver acertado todos os pares...
                  <br />E se ninguém achou que alguma de seus pesadelos eram relacionados com sua dica.
                </>
              }
              en={
                <>
                  So how did you do?
                  <br />
                  You win the game if you have found the most pairs...
                  <br />
                  And nobody thought one of your nightmares were related to one of your clues.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepResults
          user={user}
          results={state.results}
          clues={state.clues}
          table={state.table}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseResolution;
