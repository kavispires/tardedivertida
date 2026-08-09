import { useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { QuestionIcon } from '@icons/QuestionIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepSwitcher } from '@components/steps/StepSwitcher';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { useOnSubmitPromptAPIRequest, useOnTriggerGuessingAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhasePromptState } from './utils/types';
import { useCharacterEliminationCache } from './utils/useCharacterEliminationCache';
import { StepSelectPrompt } from './StepSelectPrompt';
import { StepWaitingForPrompt } from './StepWaitingForPrompt';

export function PhasePrompt({ state, players, user }: PhaseProps<PhasePromptState>) {
  const { step, setStep } = useStep();
  const [activePlayer, isUserTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPrompt = useOnSubmitPromptAPIRequest(setStep);
  const onTriggerGuessing = useOnTriggerGuessingAPIRequest(setStep);
  const { resetCache } = useCharacterEliminationCache();

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions as dependencies
  useEffect(() => {
    if (state.questionsHistory.length === 0) {
      resetCache();
    }
  }, [state.questionsHistory]);

  const announcement = (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
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
      <Surface>
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
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TA_NA_CARA_PHASES.PROMPT}
      hasRequiredData={!!user.targetPlayerId && !!user.guesserPlayerId}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isUserTheActivePlayer}>
            <StepSelectPrompt
              announcement={announcement}
              players={players}
              user={user}
              activePlayerId={state.activePlayerId}
              turnOrder={state.turnOrder}
              characters={state.characters}
              questionsHistory={state.questionsHistory}
              onSubmitPrompt={onSubmitPrompt}
              onTriggerGuessing={onTriggerGuessing}
            />
          </ViewIf>
          <ViewIf condition={!isUserTheActivePlayer}>
            <StepWaitingForPrompt
              announcement={announcement}
              players={players}
              user={user}
              turnOrder={state.turnOrder}
              characters={state.characters}
              questionsHistory={state.questionsHistory}
              activePlayer={activePlayer}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
