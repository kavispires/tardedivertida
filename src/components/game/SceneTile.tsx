import clsx from 'clsx';
// Ant Design Resources
import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Sass
import './SceneTile.scss';

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
  onSelectValue?: GenericFunction;
};

/**
 * Scene tile component
 */
export function SceneTile({ tile, index, onSelectValue }: SceneTileProps) {
  const { language } = useLanguage();
  return (
    <div className={clsx('scene-tile', `scene-tile--${tile.type}`)}>
      <Popover content={tile.description[language]}>
        <h4 className="scene-tile__title">{tile.title[language]}</h4>
      </Popover>
      <ul className="scene-tile__options">
        {tile.values.map((entry, i) => {
          const isActive = i === index;
          const isInative = index !== undefined && !isActive;
          return (
            <li key={`${tile.id}-value-${i}`}>
              <Button
                className={clsx(
                  'scene-tile__button',
                  `scene-tile__button--${tile.type}`,
                  isInative && 'scene-tile__button--inactive'
                )}
                icon={isActive ? <CheckCircleFilled className="scene-tile__icon" /> : undefined}
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
