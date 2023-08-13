// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitSeedingAPIRequest } from './utils/api-requests';
// Icons
import { BooksIcon } from 'icons/BooksIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSeedAlien } from './StepSeedAlien';

export function PhaseAlienSeeding({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitSeeds = useOnSubmitSeedingAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<BooksIcon />}
      title={<Translate pt="Análise de Objetos" en="Objects analyses" />}
      currentRound={state?.round?.current}
      type="overlay"
    ></PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.COMUNICACAO_ALIENIGENA.ALIEN_SEEDING}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepSeedAlien
          players={players}
          onSubmitSeeds={onSubmitSeeds}
          announcement={announcement}
          user={user}
          items={state.items}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
