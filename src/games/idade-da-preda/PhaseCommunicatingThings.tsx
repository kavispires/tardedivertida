// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { PencilIcon } from '@icons/PencilIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseCommunicatingThingsState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnSubmitNameAPIRequest } from './utils/api-requests';
import { StepNameAThing } from './StepNameAThing';

export function PhaseCommunicatingThings({
  state,
  players,
  user,
}: PhaseProps<PhaseCommunicatingThingsState>) {
  const { step, setStep } = useStep();
  const onSubmitName = useOnSubmitNameAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PencilIcon />}
      title={
        <Translate
          pt="Crie um novo nome"
          en="Create a new name"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Vamos expandir nosso dicionário."
          en="Let's expand our dictionary."
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={IDADE_DA_PREDA_PHASES.COMMUNICATING_THINGS}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 1 */}
        <StepNameAThing
          user={user}
          players={players}
          announcement={announcement}
          basicConcepts={state.basicConcepts}
          concepts={state.concepts}
          round={state.round}
          items={state.items}
          pool={state.pool}
          onSubmitName={onSubmitName}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
