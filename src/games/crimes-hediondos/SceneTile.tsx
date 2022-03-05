import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import clsx from 'clsx';
import { useLanguage } from 'hooks';

type SceneTileProps = {
  tile: SceneTile;
  index?: number;
  onSelectValue?: GenericFunction;
};

export function SceneTile({ tile, index, onSelectValue }: SceneTileProps) {
  const { language } = useLanguage();
  return (
    <div className={clsx('h-scene-tile', `h-scene-tile--${tile.type}`)}>
      <Popover content={tile.description[language]}>
        <h4 className="h-scene-tile__title">{tile.title[language]}</h4>
      </Popover>
      <ul className="h-scene-tile__options">
        {tile.values.map((entry, i) => {
          const isActive = i === index;
          return (
            <li key={`${tile.id}-value-${i}`}>
              <Button
                className={clsx('h-scene-tile__button', `h-scene-tile__button--${tile.type}`)}
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
