import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Popconfirm, Select, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// Hooks
import { useLoading } from '../../../hooks';

function LocationSelect({ locations, onSend }) {
  const [isLoading] = useLoading();
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <Space className="e-select-container e-select-container--locations">
      <Select onChange={setSelectedLocation} placeholder="Chute um local">
        {locations.map((location) => (
          <Select.Option key={`select-${location}`} value={location}>
            {location}
          </Select.Option>
        ))}
      </Select>
      <Popconfirm
        title={`Você só pode chutar uma vez durante o jogo! Tem certeza que quer chutar ${selectedLocation}?`}
        onConfirm={() => onSend({ guess: selectedLocation })}
        okText="Sim"
        cancelText="Não"
      >
        <Button
          type="primary"
          disabled={!selectedLocation || isLoading}
          icon={isLoading ? <LoadingOutlined /> : null}
        >
          Chutar{selectedLocation ? `: ${selectedLocation}` : ''}
        </Button>
      </Popconfirm>
    </Space>
  );
}

LocationSelect.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.object,
};

export default LocationSelect;
