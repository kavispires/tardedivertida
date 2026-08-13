// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { SpeechBubbleHeartIcon } from '@icons/SpeechBubbleHeartIcon';
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
      icon={<SpeechBubbleHeartIcon />}
      title={
        <Translate
          pt="Anarrië!"
          en="Card Play!"
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
              É a vez de <PlayerAvatarName player={activePlayer} />!
            </>
          }
          en={
            <>
              It's <PlayerAvatarName player={activePlayer} />
              's turn!
            </>
          }
        />
      </Surface>
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
          <Surface>
            <Translate
              en="Chegue mais perto do seu par ideal!"
              pt="Chegue mais perto do seu par ideal!"
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
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
          effectKeyword={state.effectKeyword}
          activePlayerId={state.activePlayerId}
          nextDrawnCardId={state.nextDrawnCardId}
          targetPlayersIds={state.targetPlayersIds}
          outcome={state.outcome}
          activePlayer={activePlayer}
          isTheActivePlayer={isTheActivePlayer}
          deck={state.deck}
          ongoingEffects={state.ongoingEffects}
          onSubmitCard={onSubmitCard}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
