import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAmIReady, useActivePlayer, useAmIActive, useAPICall, useIsMyTeamActive } from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import DialGuessSelection from './DialGuessSelection';

function GuessPhase({ state, players, info }) {
  const amIReady = useAmIReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useActivePlayer(state, players, 'psychic');
  const controller = useActivePlayer(state, players, 'teamController');
  const amITheController = useAmIActive(state, 'teamController');
  const amIThePsychic = useAmIActive(state, 'psychic');
  const isMyTeamActive = useIsMyTeamActive(state, players);

  const onSendGuess = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitGuess,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Chute submetido com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar seu chute',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}
      className="o-guess-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <DialGuessSelection
          activeTeam={state.activeTeam}
          psychic={psychic}
          teamController={controller}
          amITheController={amITheController}
          onSendGuess={onSendGuess}
          isMyTeamActive={isMyTeamActive}
          card={state.card}
          amIThePsychic={amIThePsychic}
        />

        {/* Step 1 */}
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar o jogo iniciar a próxima fase."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

GuessPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default GuessPhase;
