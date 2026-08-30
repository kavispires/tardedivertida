// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
// Icons
import { LoveLetterIcon } from '@icons/LoveLetterIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseRoundRankingState } from './utils/types';
import { CORREIO_DO_AMOR_PHASES } from './utils/constants';
import { StepRoundResults } from './StepRoundResults';
import { StepRanking } from './StepRanking';

export function PhaseRoundRanking({ players, state }: PhaseProps<PhaseRoundRankingState>) {
  const { step, goToNextStep, goToPreviousStep } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<LoveLetterIcon />}
      title={
        <Translate
          pt="Quem chegou mais próximo do amor verdadeiro?"
          en="Who got closest to true love?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    />
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={CORREIO_DO_AMOR_PHASES.ROUND_RANKING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepRoundResults
          players={players}
          announcement={announcement}
          cardsDict={state.cardsDict}
          cardsSetAside={state.cardsSetAside}
          ongoingEffects={state.ongoingEffects}
          goToNextStep={goToNextStep}
          newCardsInDeck={state.newCardsInDeck}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
          outcome={state.outcome}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
