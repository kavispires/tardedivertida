// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { FilterIcon } from 'icons/FilterIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitCharactersAPIRequest } from './utils/api-requests';
import { StepSelectCharacters } from './StepSelectCharacters';

export function PhaseCharacterFiltering({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSelectCharacters = useOnSubmitCharactersAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<FilterIcon />}
      title={<Translate pt="Quem você conhece?" en="Who do you know?" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Selecione personagens/pessoas que você conhece</>}
          en={<>Select characters/people you know</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.QUEM_SOU_EU.CHARACTER_FILTERING}>
      <StepSwitcher step={step} players={players}>
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
