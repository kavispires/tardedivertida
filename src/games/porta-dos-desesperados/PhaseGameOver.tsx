// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';

function PhaseGameOver({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const { step, goToNextStep } = useStep();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.PORTA_DOS_DESESPERADOS.GAME_OVER}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={translate('?', '?')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>Add text here</Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <div>Add Content Here {user.name}</div>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseGameOver;
