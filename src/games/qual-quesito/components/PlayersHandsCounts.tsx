// Types
import type { GamePlayers } from 'types/game';
// Icons
import { HandOfCardsIcon } from '@icons/HandOfCardsIcon';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerCounts } from '@components/players/PlayerCounts';

type PlayersHandsCountsProps = {
  players: GamePlayers;
  turnOrder: GameOrder;
};

export function PlayersHandsCounts({ players, turnOrder }: PlayersHandsCountsProps) {
  return (
    <PlayerCounts
      players={players}
      turnOrder={turnOrder}
      countGetter={(player) => player.hand.length}
      title={
        <Translate
          pt="Cartas na mão"
          en="Cards in hand"
        />
      }
      icon={<HandOfCardsIcon />}
      size="large"
    />
  );
}
