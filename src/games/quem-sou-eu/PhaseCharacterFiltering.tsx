// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitCharactersAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { FilterIcon } from 'icons/FilterIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepSelectCharacters } from './StepSelectCharacters';
import { CardHighlight } from 'components/metrics/CardHighlight';

export function PhaseCharacterFiltering({ players, state, info }: PhaseProps) {
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
          pt={
            <>
              Selecione <CardHighlight>6 cartas</CardHighlight> com personagens/pessoas que você conhece
            </>
          }
          en={
            <>
              Select <CardHighlight>6 cards</CardHighlight> with characters/people you know
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_SOU_EU.CHARACTER_FILTERING}>
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
