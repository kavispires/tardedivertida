// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnMakeReady, useOnSubmitAlienResponseAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepAlienAnswers } from './StepAlienAnswers';
import { HieroglyphIcon } from 'components/icons/HieroglyphIcon';

export function PhaseAlienAnswer({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  const [currentHuman, isUserTheCurrentHuman] = useWhichPlayerIsThe('humanId', state, players);

  const { step } = useStep();

  const onSubmitAlienResponse = useOnSubmitAlienResponseAPIRequest();
  const onConfirmNote = useOnMakeReady();

  const announcement = (
    <PhaseAnnouncement
      icon={<HieroglyphIcon />}
      title={<Translate pt="Resposta do Alienígena" en="Alien Answer" />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_ANSWER}
    >
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <StepAlienAnswers
          players={players}
          onSubmitAlienResponse={onSubmitAlienResponse}
          onConfirmNote={onConfirmNote}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          currentHuman={currentHuman}
          isUserTheCurrentHuman={isUserTheCurrentHuman}
          items={state.items}
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          currentInquiry={state.currentInquiry}
          alienResponse={state.alienResponse}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
