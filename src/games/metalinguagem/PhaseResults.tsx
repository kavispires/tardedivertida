// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DictionaryIcon } from 'icons/DictionaryIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import type { PhaseResultsState } from './utils/types';
import { StepResults } from './StepResults';

export function PhaseResults({ players, state }: PhaseProps<PhaseResultsState>) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [creator, isTheCreator] = useWhichPlayerIsThe('creatorId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<DictionaryIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              E <TextHighlight>{state.newWord}</TextHighlight> entra para o dicionário?
            </>
          }
          en={
            <>
              Does <TextHighlight>{state.newWord}</TextHighlight> enter the dictionary?
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.METALINGUAGEM.RESULTS}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResults
          players={players}
          creator={creator}
          announcement={announcement}
          items={state.items}
          wordLengths={state.wordLengths}
          newWord={state.newWord}
          turnOrder={state.turnOrder}
          guessPlayersPerItem={state.guessPlayersPerItem}
          beginsWith={state.beginsWith}
          endsWith={state.endsWith}
          names={state.names}
          namesIndexes={state.namesIndexes}
          outcome={state.outcome}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
