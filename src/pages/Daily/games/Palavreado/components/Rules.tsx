import { Typography } from 'antd';
import { Translate } from 'components/language';
import { BetaBanner } from 'pages/Daily/components/BetaBanner';

export function Rules() {
  return (
    <Typography>
      <BetaBanner />
      <Translate
        pt={
          <>
            <li>Em breve</li>
            <li>Boa sorte!</li>
          </>
        }
        en={
          <>
            <li>TBD</li>
            <li>Good luck!</li>
          </>
        }
      />
    </Typography>
  );
}
