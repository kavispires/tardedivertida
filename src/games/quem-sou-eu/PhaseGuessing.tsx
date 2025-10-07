// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitGuessesAPIRequest } from './utils/api-requests';
import { QUEM_SOU_EU_PHASES } from './utils/constants';
import { ScoringRules } from './components/RulesBlobs';
import { StepGuessing } from './StepGuessing';

export function PhaseGuessing({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitGuesses = useOnSubmitGuessesAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EvaluateIcon />}
      title={
        <Translate pt="Pareie os personagens e símbolos" en="Pair characters with the players' glyphs" />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <ScoringRules currentRound={state.round.current} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={QUEM_SOU_EU_PHASES.GUESSING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepGuessing
          user={user}
          onSubmitGuesses={onSubmitGuesses}
          characters={state.characters}
          tableOrder={state.tableOrder}
          players={players}
          announcement={announcement}
          round={state.round}
          imageCardMode={state.mode === 'imageCards'}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
