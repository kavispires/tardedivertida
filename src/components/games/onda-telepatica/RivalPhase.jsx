import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message } from 'antd';
// Hooks
import {
  useIsUserReady,
  useWhichPlayerIsThe,
  useIsUserThe,
  useAPICall,
  useIsUsersTeamActive,
} from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import DialRivalSelection from './DialRivalSelection';
import { getOppositeTeam } from '../../../utils';
import { messageContent } from '../../modals/messageContent';

function RivalPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const rivalController = useWhichPlayerIsThe('rivalController', state, players);
  const isUserTheRivalController = useIsUserThe('rivalController', state);
  const isUsersTeamActive = useIsUsersTeamActive(state, players);

  const onSendRivalGuess = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitRivalGuess,
    actionName: 'submit-rival-guess',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Chute submetido com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar seu chute',
  });

  useEffect(() => {
    if (isUserTheRivalController) {
      message.info(
        messageContent('Você controla!', 'Aperte um dos botões após seu time discutir', rivalController.name)
      );
    }
  }, [isUserTheRivalController, rivalController.name]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.RIVAL_GUESS}
      className="o-guess-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <DialRivalSelection
          rivalTeam={getOppositeTeam(state.teams, state.activeTeam)}
          rivalController={rivalController}
          isUserTheRivalController={isUserTheRivalController}
          onSendRivalGuess={onSendRivalGuess}
          isUsersTeamRival={!isUsersTeamActive}
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
