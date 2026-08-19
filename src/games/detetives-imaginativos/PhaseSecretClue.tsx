import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { SecretIcon } from '@icons/SecretIcon';
// Components
import { ImageCardPreloadHand } from '@components/image-cards/ImageCardPreloadHand';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitSecretClueAPIRequest } from './utils/api-requests';
import { DETETIVES_IMAGINATIVOS_PHASES } from './utils/constants';
import type { PhaseSecretClueState } from './utils/types';
import { StepSecretClueWrite } from './StepSecretClueWrite';
import { StepSecretClueWaiting } from './StepSecretClueWaiting';

export function PhaseSecretClue({ state, players, user }: PhaseProps<PhaseSecretClueState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [leader, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);

  const onSubmitSecretClue = useOnSubmitSecretClueAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SecretIcon />}
      title={
        <Translate
          pt="Pista Secreta"
          en="Secret Clue"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Para essa rodada, {leader} será o(a) Detetive Líder."
          en="For this round, {leader} will be the Lead Detective."
          values={{
            leader: (
              <PlayerAvatarName
                player={leader}
                addressUser
              />
            ),
          }}
        />
      </Surface>
      <ImageCardPreloadHand hand={user?.hand} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={DETETIVES_IMAGINATIVOS_PHASES.SECRET_CLUE}
      className="d-secret-clue-phase"
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          unskippable
        />

        {/* Step 1 */}
        <Fragment>
          <ViewIf condition={isUserTheLeader}>
            <StepSecretClueWrite
              user={user}
              onSubmitClue={onSubmitSecretClue}
              announcement={announcement}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheLeader}>
            <StepSecretClueWaiting
              user={user}
              leader={leader}
              players={players}
              turnOrder={state.turnOrder}
              announcement={announcement}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
