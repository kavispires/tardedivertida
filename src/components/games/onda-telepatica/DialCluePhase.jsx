import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useAmIReady, useActivePlayer, useAmIActive, useAPICall } from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher from '../../shared/StepSwitcher';
import Card from './Card';
import DialClueWriting from './DialClueWriting';

function DialCluePhase({ state, players, info }) {
  const amIReady = useAmIReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useActivePlayer(state, players, 'psychic');
  const amIThePsychic = useAmIActive(state, 'psychic');

  const onSendClue = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitClue,
    actionName: 'submit-clue',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Dica submetida com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar a dica',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_CLUE}
      className="o-dial-clue-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <Fragment>
          {!amIThePsychic ? (
            <WaitingRoom
              players={players}
              title={`${psychic.name} está pensando em uma dica...`}
              instruction="Aguarde enquanto ele(a) escreve uma dica para:"
            >
              <div className="container container--center">
                <Card left={state.card.left} right={state.card.right} />
              </div>
            </WaitingRoom>
          ) : (
            <DialClueWriting card={state.card} onSendClue={onSendClue} />
          )}
        </Fragment>

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

DialCluePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default DialCluePhase;
