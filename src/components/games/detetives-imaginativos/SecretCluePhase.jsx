import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useIsUserReady, useIsUserThe, useWhichPlayerIsThe, useAPICall, useUser } from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  Instruction,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  ViewIf,
  WaitingRoom,
} from '../../shared';
import { AvatarName } from '../../avatars';
import SecretClueWrite from './SecretClueWrite';
import SecretClueWaiting from './SecretClueWaiting';

function SecretCluePhase({ state, players, info }) {
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const leader = useWhichPlayerIsThe('leader', state, players);
  const isUserTheLeader = useIsUserThe('leader', state);
  const [step, setStep] = useState(0);

  const onSubmitSecretClue = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-secret-clue',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: 'Pista Secreta submetida com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pista secreta',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE}
      className="d-secret-clue-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={() => setStep(1)} time={5}>
          <Instruction contained>
            Para essa rodada, <AvatarName player={leader} addressUser /> será o(a) líder!
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <Step fullWidth>
          <ViewIf isVisible={!isUserTheLeader}>
            <SecretClueWaiting user={user} leader={leader} />
          </ViewIf>

          <ViewIf isVisible={isUserTheLeader}>
            <SecretClueWrite user={user} onSubmitClue={onSubmitSecretClue} />
          </ViewIf>
        </Step>

        {/* Step 2 */}
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Aguardando o servidor dar sinal de vida"
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

SecretCluePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.number,
  }),
};

export default SecretCluePhase;
