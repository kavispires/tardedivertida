// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitPromptAPIRequest, useOnSubmitTargetAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ChoiceIcon } from 'icons/ChoiceIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectPrompt } from './StepSelectPrompt';
import { ViewOr } from 'components/views';
import { StepWaitingForPrompt } from './StepWaitingForPrompt';
import { AvatarName } from 'components/avatars';

export function PhasePrompt({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);
  const onSubmitTarget = useOnSubmitTargetAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChoiceIcon />}
      title={<Translate pt="Pergunta" en="Question" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        {isUserTheActivePlayer ? (
          <Translate pt="É a sua vez!" en="It's your turn!" />
        ) : (
          <Translate
            pt={
              <>
                É a vez do(a) <AvatarName player={activePlayer} />
              </>
            }
            en={
              <>
                It's <AvatarName player={activePlayer} /> turn!
              </>
            }
          />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TA_NA_CARA.PROMPT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isUserTheActivePlayer}>
          <StepSelectPrompt
            announcement={announcement}
            players={players}
            user={user}
            turnOrder={state.turnOrder}
            charactersDict={state.charactersDict}
            charactersIds={state.charactersIds}
            questionsDict={state.questionsDict}
            onSubmitPrompt={onSubmitPrompt}
            onSubmitTarget={onSubmitTarget}
            activePlayerId={state.activePlayerId}
          />

          <StepWaitingForPrompt
            announcement={announcement}
            players={players}
            user={user}
            turnOrder={state.turnOrder}
            charactersDict={state.charactersDict}
            charactersIds={state.charactersIds}
            questionsDict={state.questionsDict}
            activePlayer={activePlayer}
            activePlayerId={state.activePlayerId}
          />
        </ViewOr>

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
