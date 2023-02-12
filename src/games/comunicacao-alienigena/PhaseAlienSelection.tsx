// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { NOOP } from 'utils/constants';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { useOnSubmitAlienAPIRequest } from './utils/api-requests';
import { StepSelectAlien } from './StepSelectAlien';
import { useCache } from 'hooks/useCache';
import { useEffectOnce } from 'react-use';
import { UfoIcon } from 'components/icons/UfoIcon';

export function PhaseAlienSelection({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitAlien = useOnSubmitAlienAPIRequest(setStep);
  const { resetCache } = useCache();

  useEffectOnce(() => {
    resetCache();
  });

  const announcement = (
    <PhaseAnnouncement
      icon={<UfoIcon />}
      title={<Translate pt="Quem quer ser o alienígena?" en="Who will be the Alien?" />}
      onClose={NOOP}
      currentRound={state?.round?.current}
      type="overlay"
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SELECTION}
    >
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <StepSelectAlien
          players={players}
          onSubmitAlien={onSubmitAlien}
          announcement={announcement}
          status={state.status}
        />

        {/* Step 1 */}
        <></>
      </StepSwitcher>
    </PhaseContainer>
  );
}
