// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitHumanInquiryAPIRequest } from './utils/api-requests';
import type { PhaseHumanAskState } from './utils/types';
import { StepHumanAsks } from './StepHumanAsks';

export function PhaseHumanAsk({ players, state }: PhaseProps<PhaseHumanAskState>) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);
  const [currentHuman, isUserTheCurrentHuman] = useWhichPlayerIsThe('humanId', state, players);

  const isFirstHuman = state.turnOrder[0] === state.humanId;
  const { step, setStep, goToNextStep } = useStep(isFirstHuman ? 0 : 1);

  const onSubmitHumanInquiry = useOnSubmitHumanInquiryAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<QuestionIcon />}
      title={<Translate pt="Pergunte ao alienígena" en="Ask the Alien" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.HUMAN_ASK}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={5} />

        {/* Step 1 */}
        <StepHumanAsks
          players={players}
          onSubmitHumanInquiry={onSubmitHumanInquiry}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          currentHuman={currentHuman}
          isUserTheCurrentHuman={isUserTheCurrentHuman}
          items={state.items}
          attributes={state.attributes}
          announcement={announcement}
          status={state.status}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
          startingAttributesIds={state.startingAttributesIds}
          debugMode={Boolean(state.debugMode)}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
