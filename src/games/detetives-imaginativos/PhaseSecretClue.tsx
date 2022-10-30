// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitSecretClueAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { ImageCardPreloadHand } from 'components/cards';
import { ViewOr } from 'components/views';

import { StepSecretClueWrite } from './StepSecretClueWrite';
import { StepSecretClueWaiting } from './StepSecretClueWaiting';
import { SecretIcon } from 'components/icons/SecretIcon';

function PhaseSecretClue({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const [leader, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitSecretClue = useOnSubmitSecretClueAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE}
      className="d-secret-clue-phase"
    >
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<SecretIcon />}
          title={<Translate pt="Pista Secreta" en="Secret Clue" />}
          onClose={goToNextStep}
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
        <ViewOr orCondition={isUserTheLeader}>
          <StepSecretClueWrite user={user} onSubmitClue={onSubmitSecretClue} />

          <StepSecretClueWaiting user={user} leader={leader} players={players} turnOrder={state.turnOrder} />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseSecretClue;
