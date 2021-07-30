import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import {
  useIsUserReady,
  useIsUserThe,
  useWhichPlayerIsThe,
  useAPICall,
  useUser,
  useLanguage,
} from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
  WaitingRoom,
} from '../../shared';
import { AvatarName } from '../../avatars';
import SecretClueWrite from './SecretClueWrite';
import SecretClueWaiting from './SecretClueWaiting';

function PhaseSecretClue({ state, players, info }) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const leader = useWhichPlayerIsThe('leader', state, players);
  const isUserTheLeader = useIsUserThe('leader', state);
  const [step, setStep] = useState(0);

  const onSubmitSecretClue = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-secret-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      'Pista Secreta submetida com sucesso',
      'Secret clue submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pista secreta',
      'Oops, the application found an error while trying to submit your secret clue',
      language
    ),
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
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={() => setStep(1)}
          time={5}
        ></RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="secret-clue"
          title={translate('Pista Secreta', 'Secret Clue', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Para essa rodada, <AvatarName player={leader} addressUser /> será o(a) Detetive Líder.
                </>
              }
              en={
                <>
                  For this round, <AvatarName player={leader} addressUser /> will be the Lead Detective.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={!isUserTheLeader}>
            <SecretClueWaiting user={user} leader={leader} />
          </ViewIf>

          <ViewIf isVisible={isUserTheLeader}>
            <SecretClueWrite user={user} onSubmitClue={onSubmitSecretClue} />
          </ViewIf>
        </Step>

        {/* Step 3 */}
        <WaitingRoom
          players={players}
          title={translate('Pronto!', 'Done!', language)}
          instruction={translate(
            'Aguardando o servidor dar sinal de vida',
            'Waiting for the server to resuscitate',
            language
          )}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseSecretClue.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    phase: PropTypes.string,
    round: PropTypes.shape({ current: PropTypes.number, total: PropTypes.number }),
  }),
};

export default PhaseSecretClue;
