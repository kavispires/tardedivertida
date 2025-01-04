// Types
import type { GamePlayers } from 'types/player';
// Utils
import { isEverybodyReady } from 'utils/helpers';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';

type AutoNextPhaseProps = {
  /**
   * Game players objects
   */
  players: GamePlayers;
};

/**
 * Add this component to a game if you want the game to automatically go to the next phase when all players are ready.
 */
export function AutoNextPhase({ players }: AutoNextPhaseProps) {
  if (!isEverybodyReady(players)) return <></>;

  return (
    <HostNextPhaseButton round={{ current: -1, total: 10, forceLastRound: false }} autoTriggerTime={20}>
      <Translate pt="Continuar" en="Next" />
    </HostNextPhaseButton>
  );
}
