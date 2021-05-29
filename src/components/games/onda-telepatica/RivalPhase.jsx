import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useActivePlayer, useIsUser, useAPICall, useIsMyTeamActive } from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import DialRivalSelection from './DialRivalSelection';

function RivalPhase({ state, players, info }) {
  const amIReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useActivePlayer(state, players, 'psychic');
  const rivalController = useActivePlayer(state, players, 'rivalController');
  const amITheRivalController = useIsUser(state, 'rivalController');
  const isMyTeamActive = useIsMyTeamActive(state, players);

  const onSendRivalGuess = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitRivalGuess,
    actionName: 'submit-rival-guess',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Chute submetido com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar seu chute',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.RIVAL_GUESS}
      className="o-guess-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <DialRivalSelection
          activeTeam={state.activeTeam === 'A' ? 'B' : 'A'}
          psychic={psychic}
          rivalController={rivalController}
          amITheRivalController={amITheRivalController}
          onSendRivalGuess={onSendRivalGuess}
          isMyTeamActive={!isMyTeamActive}
          card={state.card}
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

RivalPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default RivalPhase;
