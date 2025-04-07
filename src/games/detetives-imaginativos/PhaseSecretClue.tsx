// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { SecretIcon } from 'icons/SecretIcon';
// Components
import { AvatarName } from 'components/avatars';
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitSecretClueAPIRequest } from './utils/api-requests';
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import { StepSecretClueWrite } from './StepSecretClueWrite';
import { StepSecretClueWaiting } from './StepSecretClueWaiting';

export function PhaseSecretClue({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const [leader, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitSecretClue = useOnSubmitSecretClueAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SecretIcon />}
      title={<Translate pt="Pista Secreta" en="Secret Clue" />}
      currentRound={state?.round?.current}
      type="overlay"
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
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE}
      className="d-secret-clue-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText=" " onPressButton={goToNextStep} time={5} />

        {/* Step 1 */}
        <ViewOr condition={isUserTheLeader}>
          <StepSecretClueWrite user={user} onSubmitClue={onSubmitSecretClue} announcement={announcement} />

          <StepSecretClueWaiting
            user={user}
            leader={leader}
            players={players}
            turnOrder={state.turnOrder}
            announcement={announcement}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
