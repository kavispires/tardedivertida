// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { PencilIcon } from 'icons/PencilIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseCommunicatingThingsState } from './utils/types';
import { IDADE_DA_PREDA_PHASES } from './utils/constants';
import { useOnSubmitNameAPIRequest } from './utils/api-requests';
import { StepNameAThing } from './StepNameAThing';

export function PhaseCommunicatingThings({ players, state }: PhaseProps<PhaseCommunicatingThingsState>) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const onSubmitName = useOnSubmitNameAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<PencilIcon />}
      title={<Translate pt="Crie um novo nome" en="Create a new name" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>Vamos expandir nosso dicionário.</>} en={<>Let's expand our dictionary.</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={IDADE_DA_PREDA_PHASES.COMMUNICATING_THINGS}>
      <StepSwitcher step={step} players={players}>
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
