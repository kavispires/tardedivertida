// Ant Design Resources
import { Alert } from 'antd';
// Components
import { Translate } from 'components/language';

export function BetaBanner() {
  return (
    <Alert
      message={
        <Translate
          pt="Jogo em fase de testes. Reporte qualquer problema."
          en="Game in beta mode. Report any bugs!"
        />
      }
      type="warning"
      showIcon
      banner
    />
  );
}
