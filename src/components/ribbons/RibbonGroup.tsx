// Types
import type { GamePlayer } from 'types/player';
// Internal
import { PlayerRibbon } from './PlayerRibbon';
import { Ribbon } from './Ribbon';

type RibbonGroupProps = {
  labels: string[] | GamePlayer[];
};

export function RibbonGroup({ labels }: RibbonGroupProps) {
  return (
    <div className="ribbon-group ribbon--absolute">
      {labels.length > 0 &&
        labels.map((label) =>
          typeof labels[0] === 'string' ? (
            <Ribbon
              key={label as string}
              label={label.length > 0 ? label.charAt(label.length - 1) : label}
              position="static"
            />
          ) : (
            <PlayerRibbon
              key={String(label)}
              player={label as GamePlayer}
              position="static"
            />
          ),
        )}
    </div>
  );
}
