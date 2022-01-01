import { CheckCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import { useLanguage } from '../../hooks';

type SceneTileProps = {
  tile: SceneTile;
  index?: number;
  onSelectValue?: GenericFunction;
};

export function SceneTile({ tile, index, onSelectValue }: SceneTileProps) {
  const language = useLanguage();
  return (
    <div className={clsx('h-scene-tile', `h-scene-tile--${tile.type}`)}>
      <h4 className="h-scene-tile__title">{tile.title[language]}</h4>
      <ul className="h-scene-tile__options">
        {tile.values.map((entry, i) => {
          const isActive = i === index;
          return (
            <li key={`${tile.id}-value-${i}`}>
              <Button
                ghost
                className="h-scene-tile__button"
                icon={isActive ? <CheckCircleFilled className="h-scene-tile__icon" /> : undefined}
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
