import { useState } from 'react';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ClientCard, SubmitPlayCardPayload, Teller } from './utils/types';
import { mockPlay } from './utils/mock';
import { useOrderedTellers } from './utils/hooks';
import { TellerBoard } from './components/TellerBoard';
import { DrawDecksModal } from './components/DrawDecksModal';
import { PeopleOrder } from './components/PeopleOrder';
import { MyHand } from './components/MyHand';

type StepPlayCardProps = {
  players: GamePlayers;
  user: GamePlayer;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  tellers: Dictionary<Teller>;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  previousPlayer: GamePlayer;
  onSubmitCard: (payload: SubmitPlayCardPayload) => void;
  cardWidth: number;
  turnOrder: TurnOrder;
} & Pick<StepProps, 'announcement'>;

export function StepPlayCard({
  announcement,
  players,
  tellers,
  deckDict,
  user,
  activePlayer,
  isTheActivePlayer,
  onSubmitCard,
  drawDeck,
  cardWidth,
  turnOrder,
}: StepPlayCardProps) {
  const [tellerId, setTellerId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);

  const tellersList = useOrderedTellers(tellers);

  useMock(() => {
    onSubmitCard(mockPlay(user, tellers, deckDict, drawDeck));
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        size="medium"
        wait
      >
        <Translate
          pt="É a vez de {player} colocar uma carta em uma fila."
          en="It's {player}'s turn to place a card in a queue."
          values={{
            player: <PlayerAvatarName player={activePlayer} />,
          }}
        />
      </StepTitle>

      {tellersList.map((teller) => (
        <TellerBoard
          key={`${teller.id}-${activePlayer?.id}`}
          teller={teller}
          deckDict={deckDict}
          cardWidth={cardWidth}
          onSelectTeller={cardId ? setTellerId : undefined}
          animate={false}
        />
      ))}

      <RuleInstruction type={isTheActivePlayer ? 'action' : 'rule'}>
        {isTheActivePlayer ? (
          <Translate
            pt="Selecione uma de suas duas cartas para colocar em uma fila.
            <br/>
            Preste atenção às regras de prioridade, porque elas podem fazer você furar a fila e entrar na frente de outra pessoa (independente da cor)."
            en="Select one of your two cards to place in a queue.
            <br/>
            Pay attention to the priority rules."
          />
        ) : (
          <Translate
            pt="O(a) jogador(a) {player} deve selecionar uma de suas cartas e colocá-la em uma das 3 filas, e então selecionar uma nova para colocar em sua mão para a próxima rodada."
            en="The player {player} must select one of their cards and place it in one of the 3 queues, and then select a new one to place in their hand for the next round."
            values={{
              player: <PlayerAvatarName player={activePlayer} />,
            }}
          />
        )}
      </RuleInstruction>

      <DrawDecksModal
        open={!!tellerId && !!cardId}
        onClose={() => setTellerId(null)}
        onSubmitCard={onSubmitCard}
        deckDict={deckDict}
        drawDeck={drawDeck}
        cardWidth={cardWidth}
        selectedCardId={cardId}
        selectedTellerId={tellerId}
      />

      <MyHand
        user={user}
        deckDict={deckDict}
        isTheActivePlayer={isTheActivePlayer}
        cardWidth={cardWidth}
        onSelectCard={setCardId}
        selectedCardId={cardId}
        drawDeck={drawDeck}
        players={players}
      />

      <PeopleOrder />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer?.id || ''}
      />
    </Step>
  );
}
