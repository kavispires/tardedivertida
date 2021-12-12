import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// Design Resources
import { Button, Space, Tooltip } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
// Hooks
import { useLocalStorage } from '../../hooks';
// Utils
import { LATEST_GAME_IDS } from '../../utils/constants';
// Components
import { Translate } from '../shared';

export function RecentlyCreatedGames() {
  const [getLocalStorage] = useLocalStorage();
  const history = useHistory();
  const [ids, setIds] = useState([]);

  const refreshIds = () => {
    setIds(Object.keys(getLocalStorage(LATEST_GAME_IDS) ?? {}).sort());
  };

  const goTo = (gameId) => {
    history.push(gameId);
  };

  useEffect(() => {
    refreshIds();
  }, []); // eslint-disable-line

  return (
    <Space>
      <span>
        <Translate pt="Jogos criados recentemente (por você)" en="Recently created games (by you)" />:
      </span>
      {ids.map((gameId) => (
        <Button key={`recent-${gameId}`} ghost onClick={() => goTo(gameId)}>
          {gameId}
        </Button>
      ))}
      <Tooltip title={<Translate pt="Atualizar lista" en="Refresh list" />}>
        <Button shape="circle" icon={<RedoOutlined />} onClick={refreshIds} ghost />
      </Tooltip>
    </Space>
  );
}
