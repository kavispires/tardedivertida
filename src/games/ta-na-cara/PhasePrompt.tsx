// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { ChoiceIcon } from 'icons/ChoiceIcon';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPromptAPIRequest, useOnSubmitTargetAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import { StepSelectPrompt } from './StepSelectPrompt';
import { StepWaitingForPrompt } from './StepWaitingForPrompt';

export function PhasePrompt({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);
  const onSubmitTarget = useOnSubmitTargetAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChoiceIcon />}
      title={
        <Translate
          pt="Pergunta"
          en="Question"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        {isUserTheActivePlayer ? (
          <Translate
            pt="É a sua vez!"
            en="It's your turn!"
          />
        ) : (
          <Translate
            pt={
              <>
                É a vez do(a) <PlayerAvatarName player={activePlayer} />
              </>
            }
            en={
              <>
                It's <PlayerAvatarName player={activePlayer} /> turn!
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
      allowedPhase={TA_NA_CARA_PHASES.PROMPT}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
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
      </StepSwitcher>
    </PhaseContainer>
  );
}
