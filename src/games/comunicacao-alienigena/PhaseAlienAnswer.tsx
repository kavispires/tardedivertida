// Types
import { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnMakeReady, useOnSubmitAlienResponseAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { HieroglyphIcon } from 'icons/HieroglyphIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepAlienAnswers } from './StepAlienAnswers';

export function PhaseAlienAnswer({ players, state, info }: PhaseProps) {
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
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_ANSWER}
    >
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
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          currentInquiry={state.currentInquiry}
          alienResponse={state.alienResponse}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributes={state.startingAttributes}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
