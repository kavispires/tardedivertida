// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitWordsAPIRequest } from './utils/api-requests';
import { WritingCluesRule } from './components/RulesBlobs';
import { StepSelectWords } from './StepSelectWords';

export function PhaseWordsSelection({ players, state, info }: PhaseProps) {
  const { step, setStep } = useStep(0);

  const user = useUser(players, state);

  const onSubmitWords = useOnSubmitWordsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<VerifyListIcon />}
      title={<Translate pt="Preparação da Grade" en="Grid Setup" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <WritingCluesRule playerCount={Object.keys(players).length} />
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.CRUZA_PALAVRAS.WORDS_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 1 */}
        <StepSelectWords
          deck={state.deck}
          onSubmitWords={onSubmitWords}
          user={user}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
