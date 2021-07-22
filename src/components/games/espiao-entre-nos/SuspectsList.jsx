import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, Tooltip } from 'antd';
import { AimOutlined, ClearOutlined, IssuesCloseOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState } from '../../../hooks';
// Utils
import { orderBy } from '../../../utils';

function SuspectsList({ players }) {
  const [cache, setCache] = useGlobalState('espiaoEntreNosCache');
  const sortedPlayers = orderBy(Object.values(players), 'name');

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
    <div className={clsx('e-list')}>
      <h3 className="e-list__title">
        <AimOutlined /> Suspeitos
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
      <ul className="e-list__list">
        {sortedPlayers.map((player) => (
          <li
            className={clsx('e-list__item', cache[player.id] && 'e-list__item--crossed')}
            key={player.id}
            role="button"
            onClick={() => onCross(player.id)}
          >
            {player.name}{' '}
            {player.usedAccusation && (
              <Tooltip title="Já usou acusação">
                <IssuesCloseOutlined size="small" />
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

SuspectsList.propTypes = {
  players: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      usedAccusation: PropTypes.bool,
    })
  ),
};

export default memo(SuspectsList);
