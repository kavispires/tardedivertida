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

export function DemoBanner() {
  return (
    <Alert
      message={
        <Translate
          pt="Você jogará uma demonstração, jogos aleatórios são usados apenas para testes. Favor dar feedback."
          en="You will play a demo, random games are used for testing. Please give feedback!"
        />
      }
      type="info"
      showIcon
      banner
    />
  );
}
