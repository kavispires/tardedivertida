import { Link } from 'react-router-dom';
import { DailyChrome } from './Common/DailyChrome';
import { Button, Flex } from 'antd';
import { Translate } from 'components/language';

export function Hub() {
  return (
    <DailyChrome>
      <Flex vertical align="center" justify="center" gap={36} style={{ marginTop: 36 }}>
        <Button>
          <Link to="/diario">
            <Translate pt="Arte Ruim Diário" en="Daily Questionable Art" />
          </Link>
        </Button>
        <Button disabled>
          <Link to="/diario/ache-isso">
            <Translate pt="Ache Isso Diário" en="Daily Find This" />
          </Link>
        </Button>
        <Button disabled>
          <Link to="/diario/quarteto">
            <Translate pt="Quarteto Diário" en="Daily Quartet" />
          </Link>
        </Button>
      </Flex>
    </DailyChrome>
  );
}
