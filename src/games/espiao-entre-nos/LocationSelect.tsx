import { useMemo, useState } from 'react';
// Design Resources
import { Button, Popconfirm, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage, useLoading } from 'hooks';
// Components
import { Translate } from 'components';

type LocationSelectProps = {
  locations: ELocation[];
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
        title={translate(
          `Você só pode chutar uma vez durante o jogo! Tem certeza que quer chutar ${selectedLocationName}?`,
          `You may guess the location only once! Are you sure you want to guess ${selectedLocationName}?`
        )}
        onConfirm={() => onSend({ locationId: selectedLocationId })}
        okText="Sim"
        cancelText="Não"
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
