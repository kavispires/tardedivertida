import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitVotesAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import { DreamBoard } from './DreamBoard';
import { StepMatchDreams } from './StepMatchDreams';

function PhaseLastChance({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SONHOS_PESADELOS.LAST_CHANCE}
      className="s-phase"
    >
      <StepSwitcher
        step={step}
        conditions={[!isUserReady]}
        players={players}
        waitingRoomContent={<DreamBoard user={user} table={state.table} />}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText="" onPressButton={() => setStep(1)} time={5}>
          <Instruction contained>
            <Translate
              pt="E não era pra ter somente 5 rodadas?"
              en="Weren't we supposed to have only 5 rounds?"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="knowledge"
          title={translate('Última Chance!', 'Last Chance', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Já que ninguém ganhou até agora, você tem uma última chance de marcar os pares corretos.
                  <br />
                  Dessa vez, quem acertar o maior número de pares ganha.
                </>
              }
              en={
                <>
                  Since nobody won so far, you have a last chance to match the pairs correctly.
                  <br />
                  This time, whoever gets the most matches win.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepMatchDreams
          players={players}
          theme={state.theme}
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

PhaseLastChance.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseLastChance;
