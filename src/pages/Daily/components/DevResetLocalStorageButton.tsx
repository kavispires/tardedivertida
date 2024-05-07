import { BugOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { isDevEnv } from 'utils/helpers';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Artista/utils/settings';

export function DevResetLocalStorageButton() {
  if (!isDevEnv) {
    return <></>;
  }

  const onReset = () => {
    localStorage.removeItem(ARTE_RUIM.TD_DAILY_ARTE_RUIM_LOCAL_TODAY);
    localStorage.removeItem(AQUI_O.TD_DAILY_AQUI_O_LOCAL_TODAY);
    localStorage.removeItem(PALAVREADO.TD_DAILY_PALAVREADO_LOCAL_TODAY);
    localStorage.removeItem(ARTISTA.TD_DAILY_ARTISTA_LOCAL_TODAY);
  };

  const onDayBefore = () => {
    const yesterday = JSON.stringify({
      id: '2023-10-30',
      number: -1,
    });
    localStorage.setItem(ARTE_RUIM.TD_DAILY_ARTE_RUIM_LOCAL_TODAY, yesterday);
    localStorage.setItem(AQUI_O.TD_DAILY_AQUI_O_LOCAL_TODAY, yesterday);
    localStorage.setItem(PALAVREADO.TD_DAILY_PALAVREADO_LOCAL_TODAY, yesterday);
    localStorage.setItem(ARTISTA.TD_DAILY_ARTISTA_LOCAL_TODAY, yesterday);
  };

  return (
    <Flex justify="center" gap={12}>
      <Button size="small" type="dashed" onClick={onReset} icon={<BugOutlined />}>
        Reset LS
      </Button>
      <Button size="small" type="dashed" onClick={onDayBefore} icon={<BugOutlined />}>
        Yesterday LS
      </Button>
    </Flex>
  );
}
