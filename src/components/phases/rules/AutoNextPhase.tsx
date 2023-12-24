import { Translate } from 'components/language';
import { HostNextPhaseButton } from 'components/host';

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
    <HostNextPhaseButton round={{ current: -1, total: 10, forceLastRound: false }} autoTriggerTime={15}>
      <Translate pt="Começar o jogo" en="Start the game" />
    </HostNextPhaseButton>
  );
}
