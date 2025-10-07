// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { HandOfCardsIcon } from 'icons/HandOfCardsIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import type { PhaseCardSelectionState } from './utils/types';
import { VICE_CAMPEAO_PHASES } from './utils/constants';
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
import { StepSelectTargetAndCard } from './StepSelectTargetAndCard';

export function PhaseCardSelection({ state, players, user }: PhaseProps<PhaseCardSelectionState>) {
  const { step, setStep, goToNextStep } = useStep();

  const onSubmitCard = useOnSubmitCardAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<HandOfCardsIcon />}
      title={<Translate pt="Prepare-se para a corrida" en="Prepare for the race" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>Escolha uma das suas três cartas</>} en={<>Choose one of your three cards</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={VICE_CAMPEAO_PHASES.CARD_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} time={5} onPressButton={goToNextStep}>
          <Instruction contained>
            <Translate en="Round" pt="Rodada" /> {state.round.current} <Translate en="of" pt="de" />{' '}
            {state.round.total}
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <StepSelectTargetAndCard
          user={user}
          players={players}
          announcement={announcement}
          cardsDict={state.cardsDict}
          race={state.race}
          onSubmitCard={onSubmitCard}
          round={state.round}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
