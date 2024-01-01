// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitHumanInquiryAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { RoundAnnouncement } from 'components/round';
import { StepHumanAsks } from './StepHumanAsks';
import { StepSwitcher } from 'components/steps';

export function PhaseHumanAsk({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.HUMAN_ASK}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        />

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
          signs={state.signs}
          announcement={announcement}
          status={state.status}
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
