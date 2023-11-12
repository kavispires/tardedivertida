import { Translate } from 'components/language';
import { VIPNextPhaseButton } from 'components/vip';

type AutoNextPhaseProps = {
  players: GamePlayers;
};

/**
 * Add this component to a game if you want the game to automatically go to the next phase when all players are ready.
 */
export function AutoNextPhase({ players }: AutoNextPhaseProps) {
  const isEverybodyReady = Object.values(players).every((player) => player.ready);

  if (!isEverybodyReady) return <></>;

  return (
    <VIPNextPhaseButton round={{ current: -1, total: 10, forceLastRound: false }} autoTriggerTime={15}>
      <Translate pt="Começar o jogo" en="Start the game" />
    </VIPNextPhaseButton>
  );
}
