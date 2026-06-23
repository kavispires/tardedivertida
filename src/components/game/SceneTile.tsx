import clsx from 'clsx';
// Ant Design Resources
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Sass
import styles from './SceneTile.module.scss';

type SceneTileProps = {
  /**
   * Scene tile
   */
  tile: CrimeSceneTile;
  /**
   * The optional answer index
   */
  index?: number;
  /**
   * Optional callback when a value is selected
   */
  onSelectValue?: ({ tileId, value }: { tileId: string; value: number }) => void;
};

/**
 * Scene tile component
 */
export function SceneTile({ tile, index, onSelectValue }: SceneTileProps) {
  const { language } = useLanguage();
  return (
    <div
      className={clsx(
        styles.sceneTile,
        styles[`sceneTile${tile.type.charAt(0).toUpperCase() + tile.type.slice(1)}`],
      )}
    >
      <Popover content={tile.description[language]}>
        <h4 className={styles.sceneTileTitle}>{tile.title[language]}</h4>
      </Popover>
      <ul className={styles.sceneTileOptions}>
        {tile.values.map((entry, i) => {
          const isActive = i === index;
          const isInative = index !== undefined && !isActive;
          return (
            <li key={`${tile.id}-value-${i}`}>
              <Button
                className={clsx(styles.sceneTileButton, isInative && styles.sceneTileButtonInactive)}
                icon={isActive ? <CheckCircleFilled className={styles.sceneTileIcon} /> : undefined}
                onClick={onSelectValue ? () => onSelectValue({ tileId: tile.id, value: i }) : () => {}}
              >
                {entry[language]}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
