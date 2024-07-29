import clsx from 'clsx';
// Ant Design Resources
import { Button, Tooltip } from 'antd';
import { ClearOutlined, EnvironmentOutlined } from '@ant-design/icons';
// Types
import type { Location } from '../utils/types';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';

type LocationsListProps = {
  locations: Location[];
};

export function LocationsList({ locations }: LocationsListProps) {
  const { translate } = useLanguage();
  const { cache, setCache } = useCache();

  const onCross = (locationId: string) => {
    setCache((s) => {
      const newState = { ...s };
      if (newState[locationId]) {
        delete newState[locationId];
      } else {
        newState[locationId] = true;
      }
      return newState;
    });
  };

  const onClearCrossed = () => {
    setCache((s) => {
      const newState = { ...s };
      Object.keys(newState).forEach((key) => {
        if (!key.startsWith('_')) {
          delete newState[key];
        }
      });
      return newState;
    });
  };

  return (
    <div className="e-list">
      <h3 className="e-list__title">
        <EnvironmentOutlined /> <Translate pt="Possíveis Locais" en="Possible Locations" />
        <Tooltip title={translate('Desmarcar todos', 'Unselect all')}>
          <Button
            shape="circle"
            ghost
            type="default"
            size="small"
            icon={<ClearOutlined />}
            onClick={onClearCrossed}
            className="e-list__clear-button"
          />
        </Tooltip>
      </h3>
      <ul className={clsx('e-list__list', 'e-list__list--column')}>
        {locations.map((location) => (
          <li
            className={clsx('e-list__item', cache[location.id] && 'e-list__item--crossed')}
            key={location.id}
            role="button"
            onClick={() => onCross(location.id)}
          >
            {location.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
