// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { FilterIcon } from '@icons/FilterIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitCharactersAPIRequest } from './utils/api-requests';
import { QUEM_SOU_EU_PHASES } from './utils/constants';
import type { PhaseCharacterFilteringState } from './utils/types';
import { StepSelectCharacters } from './StepSelectCharacters';

export function PhaseCharacterFiltering({ state, players, user }: PhaseProps<PhaseCharacterFilteringState>) {
  const { step, setStep } = useStep();

  const onSelectCharacters = useOnSubmitCharactersAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<FilterIcon />}
      title={
        <Translate
          pt="Quem você conhece?"
          en="Who do you know?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Surface>
        <Translate
          pt="Selecione personagens/pessoas que você conhece"
          en="Select characters/people you know"
        />
      </Surface>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={QUEM_SOU_EU_PHASES.CHARACTER_FILTERING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSelectCharacters
          user={user}
          onSelectCharacters={onSelectCharacters}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
