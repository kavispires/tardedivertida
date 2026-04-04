// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { RoundAnnouncement } from 'components/round/RoundAnnouncement';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import type { PhaseCardPlayState } from './utils/types';
import { NA_FILA_DO_BANCO_PHASES } from './utils/constants';
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
import { StepAnimatePreviousAction } from './StepAnimatePreviousAction';

export function PhaseCardPlay({ players, state, user }: PhaseProps<PhaseCardPlayState>) {
  const isNewRound = Object.values(state.tellers).every((teller) => teller.queue.length <= 1);
  const { step, goToNextStep } = useStep(isNewRound ? 0 : 1);
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [previousPlayer, isThePreviousPlayer] = useWhichPlayerIsThe('previousPlayerId', state, players);
  const onSubmitCard = useOnSubmitCardAPIRequest();

  console.log({ step, isNewRound });

  const announcement = (
    <PhaseAnnouncement
      icon={<TDIcon />}
      title={
        <Translate
          pt="?"
          en="?"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={NA_FILA_DO_BANCO_PHASES.CARD_PLAY}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 - Only during new rounds */}
        <RoundAnnouncement
          round={state.round}
          time={3}
          onPressButton={goToNextStep}
          unskippable
        >
          <Instruction>
            <Translate
              pt="Um dia normal na fila do banco..."
              en="A normal day in the bank line..."
            />
          </Instruction>
        </RoundAnnouncement>

        <StepAnimatePreviousAction
          key={state.activePlayerId}
          user={user}
          players={players}
          // announcement={announcement}
          deckDict={state.deckDict}
          drawDeck={state.drawDeck}
          tellers={state.tellers}
          goToNextStep={goToNextStep}
          isTheActivePlayer={isTheActivePlayer}
          activePlayer={activePlayer}
          previousPlayer={previousPlayer}
          onSubmitCard={onSubmitCard}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
