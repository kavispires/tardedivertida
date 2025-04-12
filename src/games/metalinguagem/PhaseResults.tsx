// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { DictionaryIcon } from 'icons/DictionaryIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import type { PhaseResultsState } from './utils/types';
import { METALINGUAGEM_PHASES } from './utils/constants';
import { StepResults } from './StepResults';

export function PhaseResults({ players, state }: PhaseProps<PhaseResultsState>) {
  const { step } = useStep();
  const [creator] = useWhichPlayerIsThe('creatorId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<DictionaryIcon />}
      title={<Translate pt="Resultado" en="Results" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
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
    <PhaseContainer phase={state?.phase} allowedPhase={METALINGUAGEM_PHASES.RESULTS}>
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
          mostVotedItems={state.mostVotedItems}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
