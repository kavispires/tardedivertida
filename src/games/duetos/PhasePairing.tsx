// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { SocksIcon } from '@icons/SocksIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitPairsAPIRequest } from './utils/api-requests';
import { DUETOS_PHASES } from './utils/constants';
import type { PhasePairingState } from './utils/types';
import { MadePairs } from './components/MadePairs';
import { StepMakePairs } from './StepMakePairs';

export function PhasePairing({ players, state, user }: PhaseProps<PhasePairingState>) {
  const { step, setStep, goToNextStep } = useStep();

  const onSubmitPairs = useOnSubmitPairsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SocksIcon />}
      title={
        <Translate
          pt="Coloque os itens em pares"
          en="Pair the items"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Faça pares com os itens e ganhe pontos por cada par igual a de outros jogadores."
          en="Pair the items and get points for each pair you match with other players"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={DUETOS_PHASES.PAIRING}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <MadePairs
              pool={state.pool}
              pairs={user?.pairs ?? []}
              size="small"
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          time={3}
          onPressButton={goToNextStep}
        />

        {/* Step 1 */}
        <StepMakePairs
          user={user}
          announcement={announcement}
          pool={state.pool}
          onSubmitPairs={onSubmitPairs}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
