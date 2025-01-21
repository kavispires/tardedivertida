// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { HieroglyphIcon } from 'icons/HieroglyphIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnMakeReady, useOnSubmitAlienResponseAPIRequest } from './utils/api-requests';
import type { PhaseAlienAnswerState } from './utils/types';
import { StepAlienAnswers } from './StepAlienAnswers';

export function PhaseAlienAnswer({ players, state }: PhaseProps<PhaseAlienAnswerState>) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  const [currentHuman] = useWhichPlayerIsThe('humanId', state, players);

  const { step } = useStep();

  const onSubmitAlienResponse = useOnSubmitAlienResponseAPIRequest();
  const onConfirmNote = useOnMakeReady();

  const announcement = (
    <PhaseAnnouncement
      icon={<HieroglyphIcon />}
      title={<Translate pt="Resposta do Alienígena" en="Alien Answer" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_ANSWER}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepAlienAnswers
          players={players}
          onSubmitAlienResponse={onSubmitAlienResponse}
          onConfirmNote={onConfirmNote}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          currentHuman={currentHuman}
          items={state.items}
          attributes={state.attributes}
          announcement={announcement}
          status={state.status}
          currentInquiry={state.currentInquiry}
          alienResponse={state.alienResponse}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          suggestions={state.suggestions}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributesIds={state.startingAttributesIds}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
