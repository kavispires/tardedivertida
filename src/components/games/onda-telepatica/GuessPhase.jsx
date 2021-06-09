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
import DialGuessSelection from './DialGuessSelection';
import { messageContent } from '../../modals/messageContent';

function GuessPhase({ state, players, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useWhichPlayerIsThe('psychic', state, players);
  const controller = useWhichPlayerIsThe('teamController', state, players);
  const isUserTheController = useIsUserThe('teamController', state);
  const isUserThePsychic = useIsUserThe('psychic', state);
  const isUsersTeamActive = useIsUsersTeamActive(state, players);

  const onSendGuess = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitGuess,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Chute submetido com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar seu chute',
  });

  useEffect(() => {
    if (isUserTheController) {
      message.info(
        messageContent(
          'Você controla!',
          'Move o ponteiro para a posição desejada pelo time e aperte Enviar Resposta',
          controller.name
        )
      );
    }
  }, [isUserTheController, controller.name]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.GUESS}
      className="o-guess-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <DialGuessSelection
          activeTeam={state.activeTeam}
          psychic={psychic}
          teamController={controller}
          isUserTheController={isUserTheController}
          onSendGuess={onSendGuess}
          isUsersTeamActive={isUsersTeamActive}
          card={state.card}
          isUserThePsychic={isUserThePsychic}
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
