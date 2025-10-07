// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitWordsAPIRequest } from './utils/api-requests';
import { CRUZA_PALAVRAS_PHASES } from './utils/constants';
import type { PhaseWordsSelectionState } from './utils/types';
import { StepSelectWords } from './StepSelectWords';

export function PhaseWordsSelection({ players, state, user }: PhaseProps<PhaseWordsSelectionState>) {
  const { step, setStep } = useStep(0);

  const onSubmitWords = useOnSubmitWordsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<VerifyListIcon />}
      title={<Translate pt="Preparação da Grade" en="Grid Setup" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={CRUZA_PALAVRAS_PHASES.WORDS_SELECTION}>
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
