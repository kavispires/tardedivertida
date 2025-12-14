// Ant Design Resources
import { Alert } from 'antd';
// Components
import { Translate } from 'components/language';

export function BetaBanner() {
  return (
    <Alert
      title={
        <Translate
          en="Game in beta mode, bugs may occur. Report any bugs!"
          pt="Jogo em modo beta, bugs podem ocorrer. Favor reportar qualquer problema!"
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
      title={
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
