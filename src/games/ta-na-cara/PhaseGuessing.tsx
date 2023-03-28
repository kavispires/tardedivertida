// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { AvatarName } from 'components/avatars';
import { ViewOr } from 'components/views';
import { StepGuessPlayer } from './StepGuessPlayer';
import { Instruction } from 'components/text';
import { StepWaitingForGuesses } from './StepWaitingForGuesses';

export function PhaseGuessing({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [targetedPlayer, isUserTheTargetedPlayer] = useWhichPlayerIsThe('targetId', state, players);
  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={<Translate pt="Quem é essa pessoa?" en="Who's that?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        {isUserTheTargetedPlayer ? (
          <Translate pt="Você está na berlinda!" en="You are the target!" />
        ) : (
          <Translate
            pt={
              <>
                O alvo é o(a) <AvatarName player={targetedPlayer} />!
              </>
            }
            en={
              <>
                The target is <AvatarName player={targetedPlayer} />!
              </>
            }
          />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TA_NA_CARA.GUESSING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={!isUserTheTargetedPlayer}>
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
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
