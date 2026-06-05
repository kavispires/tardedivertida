import type { ReactNode } from 'react';
// Ant Design Resources
import { Alert, Typography } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import { checkWeekend } from '../utils';

type RulesWrapperProps = {
  date: string;
  basicRules: ReactNode;
  weekendRules?: ReactNode;
  betaVersion?: boolean;
  demoVersion?: boolean;
  updatedRules?: boolean;
  additionalRules?: ReactNode;
};

export function RulesWrapper({
  date,
  basicRules,
  weekendRules,
  betaVersion,
  demoVersion,
  updatedRules,
  additionalRules,
}: RulesWrapperProps) {
  const isWeekend = checkWeekend(date) && !!weekendRules;

  return (
    <Typography>
      {betaVersion && <BetaBanner />}
      {demoVersion && <DemoBanner />}
      {updatedRules && <UpdatedRulesBanner />}
      {isWeekend ? (
        <>
          <Translate
            pt={<strong>Especial Fim de Semana</strong>}
            en={<strong>Weekend Special</strong>}
          />
          {weekendRules}
        </>
      ) : (
        basicRules
      )}
      {additionalRules}
    </Typography>
  );
}

function BetaBanner() {
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

function DemoBanner() {
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

function UpdatedRulesBanner() {
  return (
    <Alert
      title={
        <Translate
          pt="Regras atualizadas! Favor ler as regras novamente."
          en="Rules updated! Please read the rules again."
        />
      }
      type="info"
      showIcon
      banner
    />
  );
}
