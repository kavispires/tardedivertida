import { useMemo } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { StatusBar } from '@components/general/StatusBar';
import { Translate } from '@components/language/Translate';
// Internal
import { PLAYER_STATUS, POINTS_GOAL } from '../utils/constants';
import {
  DeckHighlight,
  DiscardHighlight,
  EliminatedHighlight,
  ReservedHighlight,
  ScoreHighlight,
} from './Highlights';

type SummaryProps = {
  players: GamePlayers;
  user: GamePlayer;
  deck: UID[];
};

export function Summary({ user, deck, players }: SummaryProps) {
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
        key: 'captchas',
        title: (
          <Translate
            pt="Cartas ainda no baralho"
            en="Cards remaining in deck"
          />
        ),
        value: <DeckHighlight>{deck.length}</DeckHighlight>,
      },
      {
        key: 'suspicions',
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
        key: 'energy',
        title: (
          <Translate
            pt="Pontos do Robô para revolução (grupo)"
            en="Robot Points to Doom (group)"
          />
        ),
        value: (
          <ScoreHighlight>
            {user.score} / {POINTS_GOAL}
          </ScoreHighlight>
        ),
      },
    ],
    [user, deck, playerCount, eliminatedPlayersCount],
  );

  if (!user) return null;

  return <StatusBar entries={entries} />;
}

type PilesSummaryProps = {
  cardsSetAside: UID[];
  discardPile: UID[];
};

export function PilesSummary({ cardsSetAside, discardPile }: PilesSummaryProps) {
  const entries = useMemo(
    () => [
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
    [cardsSetAside, discardPile],
  );

  return <StatusBar entries={entries} />;
}
