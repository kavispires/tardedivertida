import { useMemo, useState } from 'react';
// Ant Design Resources
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Select, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language';
// Internal
import type { Location } from '../utils/types';

type LocationSelectProps = {
  locations: Location[];
  onSend: GenericFunction;
};

export function LocationSelect({ locations, onSend }: LocationSelectProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');

  const onSelectLocation = (locationId: string) => setSelectedLocationId(locationId);

  const selectedLocationName = useMemo(() => {
    return locations.find((location) => location.id === selectedLocationId)?.name ?? '';
  }, [selectedLocationId, locations]);

  return (
    <Space className="e-select-container e-select-container--locations">
      <Select onChange={onSelectLocation} placeholder={translate('Chute um local', 'Guess location')}>
        {locations.map((location) => (
          <Select.Option key={`select-${location.id}`} value={location.id}>
            {location.name}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm
        title={
          <Translate
            pt={`Você só pode chutar uma vez durante o jogo! Tem certeza que quer chutar ${selectedLocationName}?`}
            en={`You may guess the location only once! Are you sure you want to guess ${selectedLocationName}?`}
          />
        }
        onConfirm={() => onSend({ locationId: selectedLocationId })}
        type="yes-no"
      >
        <Button
          type="primary"
          disabled={!selectedLocationId || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          <Translate pt="Chutar" en="Guess" />
          {selectedLocationName ? `: ${selectedLocationName}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}
