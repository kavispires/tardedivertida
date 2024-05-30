import { App, Button, Flex } from 'antd';

import { BugOutlined } from '@ant-design/icons';

import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Artista/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { isDevEnv } from 'utils/helpers';
import { Translate } from 'components/language';

const keys = [AQUI_O, ARTE_RUIM, PALAVREADO, ARTISTA, FILMACO];

export function DevResetLocalStorageButton() {
  const { message } = App.useApp();

  const onReset = () => {
    keys.forEach((key) => localStorage.removeItem(key.LOCAL_TODAY_KEY));
    message.success(<Translate pt="LS resetado corretamente" en="LS reset successfully" />);
  };

  const onDayBefore = () => {
    const yesterday = JSON.stringify({
      id: '2023-10-30',
      number: -1,
    });
    keys.forEach((key) => localStorage.setItem(key.LOCAL_TODAY_KEY, yesterday));
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
