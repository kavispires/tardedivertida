import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { StatusBar } from '@components/general/StatusBar';
import { Translate } from '@components/language/Translate';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
// Internal
import { PLAYER_STATUS, POINTS_GOAL } from '../utils/constants';
import type { OngoingEffect } from '../utils/types';
import {
  DeckHighlight,
  DiscardHighlight,
  EliminatedHighlight,
  OngoingEffectsHighlight,
  ReservedHighlight,
  ScoreHighlight,
} from './Highlights';

type RoundSummaryProps = {
  players: GamePlayers;
  user: GamePlayer;
  ongoingEffects: OngoingEffect[];
};

function RoundSummary({ user, ongoingEffects, players }: RoundSummaryProps) {
  const { eliminatedPlayersCount, playerCount } = useMemo(() => {
    const playersList = Object.values(players);

    return {
      eliminatedPlayersCount: playersList.filter((p) => p.status === PLAYER_STATUS.ELIMINATED).length,
      playerCount: playersList.length,
    };
  }, [players]);

  const entries = useMemo(
    () => [
      {
        key: 'eliminated-players',
        title: (
          <Translate
            pt="Jogadores Eliminados"
            en="Eliminated Players"
          />
        ),
        value: (
          <EliminatedHighlight>
            {eliminatedPlayersCount}/{playerCount}
          </EliminatedHighlight>
        ),
      },
      {
        key: 'score',
        title: (
          <Translate
            pt="Seus pontos ganhos até agora"
            en="Points you've earned so far"
          />
        ),
        value: (
          <ScoreHighlight>
            {user.score} / {POINTS_GOAL}
          </ScoreHighlight>
        ),
      },
      {
        key: 'ongoing-effects',
        title: (
          <Translate
            pt="Efeitos em andamento"
            en="Ongoing Effects"
          />
        ),
        value: <OngoingEffectsHighlight>{ongoingEffects.length}</OngoingEffectsHighlight>,
      },
    ],
    [user, ongoingEffects, playerCount, eliminatedPlayersCount],
  );

  if (!user) return null;

  return <StatusBar entries={entries} />;
}

type PilesSummaryProps = {
  deck: UID[];
  cardsSetAside: UID[];
  discardPile: UID[];
};

function PilesSummary({ cardsSetAside, discardPile, deck }: PilesSummaryProps) {
  const entries = useMemo(
    () => [
      {
        key: 'deck',
        title: (
          <Translate
            pt="Cartas ainda no baralho"
            en="Cards remaining in deck"
          />
        ),
        value: <DeckHighlight>{deck.length}</DeckHighlight>,
      },
      {
        key: 'aside-pile',
        title: (
          <Translate
            pt="Cartas Separadas No Início da Rodada"
            en="Cards set aside at the beginning of the round"
          />
        ),
        value: <ReservedHighlight>{cardsSetAside.length}</ReservedHighlight>,
      },
      {
        key: 'discard-pile',
        title: (
          <Translate
            pt="Cartas Descartadas"
            en="Discarded Cards"
          />
        ),
        value: <DiscardHighlight>{discardPile.length}</DiscardHighlight>,
      },
    ],
    [cardsSetAside, discardPile, deck],
  );

  return <StatusBar entries={entries} />;
}

type SummaryProps = {
  players: GamePlayers;
  user: GamePlayer;
  ongoingEffects: OngoingEffect[];
  deck: UID[];
  turnOrder: GameOrder;
  activePlayerId: UID;
  discardPile: UID[];
  cardsSetAside: UID[];
};

export function Summary({
  user,
  ongoingEffects,
  players,
  deck,
  turnOrder,
  activePlayerId,
  discardPile,
  cardsSetAside,
}: SummaryProps) {
  return (
    <Flex
      justify="center"
      wrap
      gap={16}
    >
      <RoundSummary
        user={user}
        ongoingEffects={ongoingEffects}
        players={players}
      />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayerId}
      />

      <PilesSummary
        cardsSetAside={cardsSetAside}
        discardPile={discardPile}
        deck={deck}
      />
    </Flex>
  );
}
