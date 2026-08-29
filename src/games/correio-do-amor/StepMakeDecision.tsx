// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { OngoingEffect, Play, SubmitSelectionsPayload, FestaJuninaCard } from './utils/types';
import { PLAYER_STATUS } from './utils/constants';
import { Summary } from './components/Summary';
import { PlayArea } from './components/PlayArea';
import { DeckExplanation } from './components/DeckExplanation';
import { NonPlayingUserArea, EliminatedUserArea } from './components/UserAreas';
import { CardEffectInteraction } from './components/CardEffectInteraction';
import { CardEffectWaitingInteraction } from './components/CardEffectWaitingInteraction';

type StepMakeDecisionProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<FestaJuninaCard>;
  turnOrder: GameOrder;
  gameOrder: GameOrder;
  startingPlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
  effectKeyword: string | null;
  activePlayerId: UID;
  targetPlayersIds: UID[];
  outcome: string;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  deck: UID[];
  ongoingEffects: OngoingEffect[];
  onSubmitSelections: (payload: SubmitSelectionsPayload) => void;
  play: Play;
} & Pick<StepProps, 'announcement'>;

export function StepMakeDecision({
  announcement,
  cardsDict,
  user,
  deck,
  turnOrder,
  gameOrder,
  activePlayer,
  players,
  cardsSetAside,
  discardPile,
  isTheActivePlayer,
  ongoingEffects,
  onSubmitSelections,
  play,
}: StepMakeDecisionProps) {
  const playedCard = cardsDict?.[play?.cardKey ?? ''] ?? null;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {playedCard ? (
          <Translate
            pt={`${playedCard.name} está aqui...`}
            en={`${playedCard.name} is here`}
          />
        ) : (
          <Translate
            pt="Hora da Decisão"
            en="Time to Decide"
          />
        )}
      </StepTitle>

      <Summary
        user={user}
        ongoingEffects={ongoingEffects}
        players={players}
        deck={deck}
        turnOrder={turnOrder}
        activePlayerId={activePlayer.id}
        discardPile={discardPile}
        cardsSetAside={cardsSetAside}
      />

      <PlayArea
        players={players}
        gameOrder={gameOrder}
        activePlayerId={activePlayer.id}
        user={user}
        userArea={
          <>
            {user.hand && user.status !== PLAYER_STATUS.ELIMINATED && (
              <NonPlayingUserArea
                cardsDict={cardsDict}
                user={user}
              />
            )}

            {user.status === PLAYER_STATUS.ELIMINATED && <EliminatedUserArea />}
          </>
        }
      >
        {isTheActivePlayer ? (
          <CardEffectInteraction
            players={players}
            play={play}
            user={user}
            cardsSetAside={cardsSetAside}
            cardsDict={cardsDict}
            onSubmitSelections={onSubmitSelections}
          />
        ) : (
          <CardEffectWaitingInteraction
            players={players}
            play={play}
            cardsDict={cardsDict}
          />
        )}
      </PlayArea>

      <DeckExplanation cardsDict={cardsDict} />
    </Step>
  );
}
