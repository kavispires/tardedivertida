import { App, Button, Flex } from 'antd';

import { BugOutlined } from '@ant-design/icons';

import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Artista/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { isDevEnv } from 'utils/helpers';
import { Translate } from 'components/language';

export function DevResetLocalStorageButton() {
  const { message } = App.useApp();

  const onReset = () => {
    localStorage.removeItem(ARTE_RUIM.TD_DAILY_ARTE_RUIM_LOCAL_TODAY);
    localStorage.removeItem(AQUI_O.TD_DAILY_AQUI_O_LOCAL_TODAY);
    localStorage.removeItem(PALAVREADO.TD_DAILY_PALAVREADO_LOCAL_TODAY);
    localStorage.removeItem(ARTISTA.TD_DAILY_ARTISTA_LOCAL_TODAY);
    message.success(<Translate pt="LS resetado corretamente" en="LS reset successfully" />);
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
        <Translate pt="Resetar LS" en="Reset LS" />
      </Button>
      {isDevEnv && (
        <Button size="small" type="dashed" onClick={onDayBefore} icon={<BugOutlined />}>
          Yesterday LS
        </Button>
      )}
    </Flex>
  );
}
