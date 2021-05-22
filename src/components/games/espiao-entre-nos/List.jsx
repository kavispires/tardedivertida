import React, { memo } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Tooltip } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
// Components
import clsx from 'clsx';
import { useGlobalState } from '../../../hooks';

function List({ header, headerIcon, items, column }) {
  const [cache, setCache] = useGlobalState('espiaoEntreNosCache');

  // const [crossed, setCrossed] = useState({});

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
    <div className={clsx('e-list', column && 'e-list--column')}>
      <h3 className="e-list__title">
        {headerIcon} {header}{' '}
        <Tooltip title="Limpar nomes">
          <Button
            shape="circle"
            ghost
            type="default"
            size="small"
            icon={<ClearOutlined />}
            onClick={onClearCrossed}
          />
        </Tooltip>
      </h3>
      <ul className={clsx('e-list__list', column && 'e-list__list--column')}>
        {items.map((item) => (
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
  header: PropTypes.string.isRequired,
  headerIcon: PropTypes.element.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
  column: PropTypes.bool,
};

List.defaultProps = {
  column: false,
};

export default memo(List);
