import { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { SONHOS_PESADELOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  WaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  Step,
  StepSwitcher,
  Translate,
  translate,
} from '../../components/shared';
import DreamBoard from './DreamBoard';
import StepMatchDreams from './StepMatchDreams';

function PhaseMatch({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);

  const onSubmitDream = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dreams',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Sonhos submetidos com sucesso', 'Dreams submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus sonhos',
      'Oops, the application found an error while trying to submit your dreams',
      language
    ),
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.SONHOS_PESADELOS.MATCH}
      className="s-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Selecione os pares', 'Match the dreams', language)}
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
        <Step fullWidth>
          <StepMatchDreams
            players={players}
            theme={state.theme}
            user={user}
            table={state.table}
            onSubmitDream={onSubmitDream}
            dreamsCount={state.dreamsCount}
            clues={state.clues}
            currentRound={state?.round?.current}
          />
        </Step>

        {/* Step 2 */}
        <Step fullWidth>
          <WaitingRoom players={players} />
          <DreamBoard user={user} table={state.table} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseMatch.propTypes = {
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

export default PhaseMatch;
