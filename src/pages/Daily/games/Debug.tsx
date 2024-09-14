import { useMemo } from 'react';
// Ant Design Resources
import { Input, Space, Typography } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import { DailyChrome } from '../components/DailyChrome';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from './Picaco/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { getToday } from '../utils';

const PRIORITY_LIST = [ARTE_RUIM, CONTROLE_DE_ESTOQUE, FILMACO, PALAVREADO, AQUI_O, ARTISTA];

export function DebugPage() {
  const { isAdmin } = useCurrentUserContext();

  if (!isAdmin) {
    return <Typography.Text>Unauthorized</Typography.Text>;
  }

  return (
    <DailyChrome>
      <Space direction="vertical" className="margin">
        <pre>Today: {getToday()}</pre>
        {PRIORITY_LIST.map((game) => (
          <Content localKey={game.KEY} />
        ))}
      </Space>
    </DailyChrome>
  );
}

function Content({ localKey }: { localKey: string }) {
  const value = useMemo(
    () => JSON.stringify(JSON.parse(localStorage.getItem(localKey) || '{}'), null, 2),
    [localKey]
  );
  return (
    <Space direction="vertical">
      <Typography.Paragraph className="center" strong>
        {localKey}
      </Typography.Paragraph>

      <Input.TextArea cols={10} rows={8} value={value} style={{ width: 'clamp(300px, 80vw, 960px)' }} />
    </Space>
  );
}
