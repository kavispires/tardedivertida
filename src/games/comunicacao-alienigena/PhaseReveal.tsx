// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Icons
import { MultitaskIcon } from 'icons/MultitaskIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepReveal } from './StepReveal';

export function PhaseReveal({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const [alien, isUserAlien] = useWhichPlayerIsThe('alienId', state, players);

  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<MultitaskIcon />}
      title={<Translate pt="E as oferendas foram..." en="And the offerings were..." />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.REVEAL}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <StepReveal
          players={players}
          user={user}
          alien={alien}
          isUserAlien={isUserAlien}
          items={state.items}
          signs={state.signs}
          announcement={announcement}
          status={state.status}
          wasCurseSelected={state.wasCurseSelected}
          curses={state.curses}
          round={state.round}
          requestHistory={state.requestHistory}
          inquiryHistory={state.inquiryHistory}
          isAlienBot={Boolean(state.alienBot)}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
