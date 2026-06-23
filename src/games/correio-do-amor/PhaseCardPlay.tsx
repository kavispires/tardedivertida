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
import { CORREIO_DO_AMOR_PHASES } from './utils/constants';
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
import { StepPlay } from './StepPlay';

export function PhaseCardPlay({ players, state, user }: PhaseProps<PhaseCardPlayState>) {
  const discardPile = state.discardPile ?? [];
  const { step, goToNextStep } = useStep(discardPile.length > 0 ? 1 : 0);
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitCard = useOnSubmitCardAPIRequest();

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
      allowedPhase={CORREIO_DO_AMOR_PHASES.CARD_PLAY}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={5}
        >
          <Instruction>
            <Translate
              en="Chegue mais perto do seu par ideal!"
              pt="Chegue mais perto do seu par ideal!"
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}

        {/* Step 2 */}
        <StepPlay
          user={user}
          players={players}
          announcement={announcement}
          cardsDict={state.cardsDict}
          turnOrder={state.turnOrder}
          gameOrder={state.gameOrder}
          startingPlayerId={state.startingPlayerId}
          discardPile={state.discardPile}
          cardsSetAside={state.cardsSetAside}
          activeEffectKeyword={state.activeEffectKeyword}
          activePlayerId={state.activePlayerId}
          nextDrawnCardId={state.nextDrawnCardId}
          targetPlayersIds={state.targetPlayersIds}
          outcome={state.outcome}
          activePlayer={activePlayer}
          isTheActivePlayer={isTheActivePlayer}
          deck={state.deck}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
