import type { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import { BetaBanner, DemoBanner } from './BetaBanner';
import { checkWeekend } from '../utils';

type RulesWrapperProps = {
  date: string;
  basicRules: ReactNode;
  weekendRules?: ReactNode;
  betaVersion?: boolean;
  demoVersion?: boolean;
  additionalRules?: ReactNode;
};

export function RulesWrapper({
  date,
  basicRules,
  weekendRules,
  betaVersion,
  demoVersion,
  additionalRules,
}: RulesWrapperProps) {
  const isWeekend = checkWeekend(date) && !!weekendRules;

  return (
    <Typography>
      {betaVersion && <BetaBanner />}
      {demoVersion && <DemoBanner />}
      {isWeekend ? (
        <>
          <Translate pt={<strong>Especial Fim de Semana</strong>} en={<strong>Weekend Special</strong>} />
          {weekendRules}
        </>
      ) : (
        basicRules
      )}
      {additionalRules}
    </Typography>
  );
}
