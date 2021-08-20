import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, Tooltip } from 'antd';
import { ClearOutlined, EnvironmentOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState } from '../../hooks';

function List({ locations }) {
  const [cache, setCache] = useGlobalState('espiaoEntreNosCache');

  const onCross = (item) => {
    setCache((s) => {
      const newState = { ...s };
      if (newState[item]) {
        delete newState[item];
      } else {
        newState[item] = true;
      }
      return newState;
    });
  };

  const onClearCrossed = () => setCache({});

  return (
    <div className="e-list">
      <h3 className="e-list__title">
        <EnvironmentOutlined /> Possíveis Locais
        <Tooltip title="Deselecionar todos">
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
        {locations.map((item) => (
          <li
            className={clsx('e-list__item', cache[item] && 'e-list__item--crossed')}
            key={item}
            role="button"
            onClick={() => onCross(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

List.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.string),
};

export default memo(List);
