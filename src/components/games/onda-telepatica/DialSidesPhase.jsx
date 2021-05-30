import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useActivePlayer, useIsUserThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { ONDA_TELEPATICA } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import PhaseContainer from '../../shared/PhaseContainer';
import WaitingRoom from '../../shared/WaitingRoom';
import StepSwitcher, { Step } from '../../shared/StepSwitcher';
import CardSelection from './CardSelection';
import RoundAnnouncement from '../../shared/RoundAnnouncement';
import Instruction from '../../shared/Instruction';
import AvatarName from '../../avatars/AvatarName';

function DialSidesPhase({ state, players, info }) {
  const amIReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const psychic = useActivePlayer(state, players, 'psychic');
  const isUserThePsychic = useIsUserThe('psychic', state);

  const onSendChosenSide = useAPICall({
    apiFunction: ONDA_TELEPATICA.submitSides,
    actionName: 'submit-side',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: 'Carta selecionada com sucesso',
    errorMessage: 'Vixi, ocorreu um erro ao tentar enviar a carta',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ONDA_TELEPATICA.DIAL_SIDES}
      className="o-dial-sides-phase"
    >
      <StepSwitcher step={step} conditions={[!amIReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={() => setStep(1)}
          players={players}
          teams={state.teams}
          time={10}
        >
          <Instruction contained>
            É a vez do
            <span className="u-word-selection-phase__guesser-name-announcement">TIME {state.activeTeam}</span>
            <br />
            {isUserThePsychic ? (
              <span className="u-word-selection-phase__guesser-name-announcement">VOCÊ</span>
            ) : (
              <AvatarName player={psychic} uppercase size="large" />
            )}
            será o(a) medium
          </Instruction>
          <div className="u-word-selection-phase__team-points"></div>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          {!isUserThePsychic ? (
            <WaitingRoom
              players={players}
              title={`${psychic.name} está escolhendo uma carta...`}
              instruction="Aguarde enquanto ele(a) decide a carta que será usada nessa rodada."
            />
          ) : (
            <CardSelection onSendChosenSide={onSendChosenSide} cards={state.cards} />
          )}
        </Step>

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar o jogo iniciar a próxima fase."
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

DialSidesPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default DialSidesPhase;
