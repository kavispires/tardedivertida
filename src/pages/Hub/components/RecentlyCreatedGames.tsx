import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Button, Space, Tooltip } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { Translate } from 'components/language';

/**
 * @deprecated
 * @returns
 */
export function RecentlyCreatedGames(): JSX.Element {
  const navigate = useNavigate();
  const [latestGameIds] = useGlobalLocalStorage('latestGameIds');

  const [ids, setIds] = useState<string[]>([]);

  const refreshIds = () => {
    setIds(Object.keys(latestGameIds ?? {}).sort());
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
