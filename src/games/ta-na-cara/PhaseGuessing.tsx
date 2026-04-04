import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import { StepGuessPlayer } from './StepGuessPlayer';
import { StepWaitingForGuesses } from './StepWaitingForGuesses';

export function PhaseGuessing({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();
  const [targetedPlayer, isUserTheTargetedPlayer] = useWhichPlayerIsThe('targetId', state, players);
  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={
        <Translate
          pt="Quem é essa pessoa?"
          en="Who's that?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        {isUserTheTargetedPlayer ? (
          <Translate
            pt="Você está na berlinda!"
            en="You are the target!"
          />
        ) : (
          <Translate
            pt={
              <>
                O alvo é o(a) <PlayerAvatarName player={targetedPlayer} />!
              </>
            }
            en={
              <>
                The target is <PlayerAvatarName player={targetedPlayer} />!
              </>
            }
          />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TA_NA_CARA_PHASES.GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={!isUserTheTargetedPlayer}>
            <StepGuessPlayer
              announcement={announcement}
              players={players}
              user={user}
              turnOrder={state.turnOrder}
              charactersDict={state.charactersDict}
              charactersIds={state.charactersIds}
              questionsDict={state.questionsDict}
              onSubmitGuess={onSubmitGuess}
              activePlayerId={state.activePlayerId}
              targetedPlayer={targetedPlayer}
              points={state.points ?? 1}
            />
          </ViewIf>
          <ViewIf condition={isUserTheTargetedPlayer}>
            <StepWaitingForGuesses
              announcement={announcement}
              players={players}
              user={user}
              turnOrder={state.turnOrder}
              charactersDict={state.charactersDict}
              charactersIds={state.charactersIds}
              questionsDict={state.questionsDict}
              activePlayerId={state.activePlayerId}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
