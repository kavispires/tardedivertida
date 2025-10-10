// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { ChoiceIcon } from 'icons/ChoiceIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPromptAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhasePromptingState } from './utils/types';
import { StepSelectPrompt } from './StepSelectPrompt';
import { StepWaitForPrompt } from './StepWaitForPrompt';

export function PhasePrompting({ meta, players, state, user }: PhaseProps<PhasePromptingState>) {
  const { step, setStep } = useStep();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<ChoiceIcon />}
      title={<Translate pt="Pergunta da Vez" en="Question" />}
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
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.PROMPTING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={!isUserTheActivePlayer}>
          <StepWaitForPrompt
            gameId={meta.gameId}
            players={players}
            user={user}
            announcement={announcement}
            activePlayer={activePlayer}
            identitiesDict={state.identitiesDict}
            grid={state.grid}
            turnOrder={state.turnOrder}
            questionCount={state.questionCount}
            questionsDict={state.questionsDict}
          />

          <StepSelectPrompt
            announcement={announcement}
            players={players}
            user={user}
            turnOrder={state.turnOrder}
            grid={state.grid}
            identitiesDict={state.identitiesDict}
            turnQuestions={state.turnQuestions}
            vibesMode={state.vibesMode}
            questionCount={state.questionCount}
            onSubmitPrompt={onSubmitPrompt}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
