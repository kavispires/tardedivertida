import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Button, Space, Tooltip } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
// Hooks
import { useLocalStorage } from 'hooks/useLocalStorage';
// Utils
import { LATEST_GAME_IDS } from 'utils/constants';
// Components
import { Translate } from 'components/language';

export function RecentlyCreatedGames(): JSX.Element {
  const navigate = useNavigate();
  const [getLocalStorage] = useLocalStorage();
  const [ids, setIds] = useState<string[]>([]);

  const refreshIds = () => {
    setIds(Object.keys(getLocalStorage(LATEST_GAME_IDS) ?? {}).sort());
  };

  const goTo = (gameId: GameId) => {
    navigate(gameId);
  };

  useEffectOnce(() => {
    refreshIds();
  });

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
