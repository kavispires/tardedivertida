import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { HandOfCardsIcon } from '@icons/HandOfCardsIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import type { PhaseCardPlayState } from './utils/types';
import { NA_FILA_DO_BANCO_PHASES } from './utils/constants';
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
import { useBankClientCardWidth } from './utils/hooks';
import { StepAnimatePreviousAction } from './StepAnimatePreviousAction';
import { StepPlayCard } from './StepPlayCard';

export function PhaseCardPlay({ players, state, user }: PhaseProps<PhaseCardPlayState>) {
  const isNewRound = Object.values(state.tellers).every((teller) => teller.queue.length <= 1);
  const startingStep = isNewRound ? 0 : 1;
  const { step, goToNextStep, setStep } = useStep(startingStep);
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);
  const [previousPlayer] = useWhichPlayerIsThe('previousPlayerId', state, players);
  const onSubmitCard = useOnSubmitCardAPIRequest();
  const [currentPlayerId, setCurrentPlayerId] = useState(state.activePlayerId);

  const cardWidth = useBankClientCardWidth(state.tellers);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions
  useEffect(() => {
    if (step !== startingStep) {
      if (!isNewRound && state.activePlayerId !== currentPlayerId) {
        setCurrentPlayerId(state.activePlayerId);
        setStep(1);
      }
    }
  }, [startingStep, isNewRound, state.activePlayerId]);

  const announcement = (
    <PhaseAnnouncement
      icon={<HandOfCardsIcon />}
      title={
        <Translate
          pt="Próximo cliente!"
          en="Next customer!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Surface>
        <Translate
          pt={
            <>
              É a vez do(a) <PlayerAvatarName player={activePlayer} /> colocar uma carta em uma fila.
            </>
          }
          en={
            <>
              It's <PlayerAvatarName player={activePlayer} />
              's turn to place a card in a queue.
            </>
          }
        />
      </Surface>
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
        key={String(step)} // Force remount when step changes to reset internal states
      >
        {/* Step 0 - Only during new rounds */}
        <RoundAnnouncement
          round={state.round}
          time={3}
          onPressButton={goToNextStep}
          unskippable
        >
          <Surface>
            <Translate
              pt="Um dia normal na fila do banco..."
              en="A normal day in the bank line..."
            />
          </Surface>
        </RoundAnnouncement>

        <StepAnimatePreviousAction
          key={state.previousPlayerId || 'no_previous_player'}
          user={user}
          players={players}
          deckDict={state.deckDict}
          drawDeck={state.drawDeck}
          round={state.round}
          tellers={state.tellers}
          goToNextStep={goToNextStep}
          isTheActivePlayer={isTheActivePlayer}
          activePlayer={activePlayer}
          previousPlayer={previousPlayer}
          cardWidth={cardWidth}
          turnOrder={state.gameOrder}
          outcome={state.outcome}
          isNewRound={isNewRound}
        />

        <StepPlayCard
          key={state.activePlayerId}
          user={user}
          players={players}
          announcement={announcement}
          deckDict={state.deckDict}
          drawDeck={state.drawDeck}
          tellers={state.tellers}
          isTheActivePlayer={isTheActivePlayer}
          activePlayer={activePlayer}
          previousPlayer={previousPlayer}
          onSubmitCard={onSubmitCard}
          cardWidth={cardWidth}
          turnOrder={state.gameOrder}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
