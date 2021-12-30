import { useState } from 'react';
// Hooks
import { useIsUserReady, useWhichPlayerIsThe, useAPICall, useUser, useLanguage } from '../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  AvatarName,
  ImageCardPreloadHand,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  Translate,
  translate,
  ViewIf,
} from '../../components';
import StepSecretClueWrite from './StepSecretClueWrite';
import StepSecretClueWaiting from './StepSecretClueWaiting';

function PhaseSecretClue({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const [leader, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);
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
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={() => setStep(1)}
          time={5}
        ></RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="secret"
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
          <ImageCardPreloadHand hand={user?.hand} />
        </PhaseAnnouncement>

        {/* Step 2 */}
        <Step fullWidth>
          <ViewIf isVisible={!isUserTheLeader}>
            <StepSecretClueWaiting user={user} leader={leader} />
          </ViewIf>

          <ViewIf isVisible={isUserTheLeader}>
            <StepSecretClueWrite user={user} onSubmitClue={onSubmitSecretClue} />
          </ViewIf>
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseSecretClue;
