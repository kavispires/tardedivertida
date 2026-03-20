import clsx from 'clsx';
// Types
import type { GamePlayer } from 'types/game';
// Internal
import { PlayerRibbon } from './PlayerRibbon';
import { Ribbon } from './Ribbon';
// Sass
import styles from './Ribbons.module.scss';

type RibbonGroupProps = {
  labels: string[] | GamePlayer[];
};

export function RibbonGroup({ labels }: RibbonGroupProps) {
  return (
    <div className={clsx(styles.ribbonGroup, styles.ribbonAbsolute)}>
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
