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

  const onClick = () => {
    localStorage.removeItem(ARTE_RUIM.TD_DAILY_ARTE_RUIM_LOCAL_TODAY);
    localStorage.removeItem(AQUI_O.TD_DAILY_AQUI_O_LOCAL_TODAY);
    localStorage.removeItem(PALAVREADO.TD_DAILY_PALAVREADO_LOCAL_TODAY);
    localStorage.removeItem(ARTISTA.TD_DAILY_ARTISTA_LOCAL_TODAY);
  };

  return (
    <Flex justify="center">
      <Button size="small" type="dashed" onClick={onClick} icon={<BugOutlined />}>
        Reset LS
      </Button>
    </Flex>
  );
}
