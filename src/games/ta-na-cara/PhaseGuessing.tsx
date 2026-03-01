// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { PlayerAvatarName } from 'components/player';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewIf } from 'components/views';
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
