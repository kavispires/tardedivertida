// Types
import type { GamePlayers } from 'types/game';
// Utils
import { isEverybodyReady } from '@utils/helpers';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';

type AutoNextPhaseProps = {
  /**
   * Game players objects
   */
  players: GamePlayers;
};

/**
 * Component that automatically triggers the next phase when all players are ready
 */
export function AutoNextPhase({ players }: AutoNextPhaseProps) {
  if (!isEverybodyReady(players)) return null;

  return (
    <HostNextPhaseButton
      round={{ current: -1, total: 10, forceLastRound: false }}
      autoTriggerTime={20}
    >
      <Translate
        pt="Continuar"
        en="Next"
      />
    </HostNextPhaseButton>
  );
}
