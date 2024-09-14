// Ant Design Resources
import { Space } from 'antd';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { TimedTimerBar, TimedTimerClock } from 'components/timers';
// Internal
import { DecisionButtons } from './DecisionButtons';
import { TestStepProps } from '../TestArea';

export function TimersTest({ onResult, step }: TestStepProps) {
  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Cronômetros" en="Timers" />
      </Title>

      <Instruction contained>
        <Translate pt="Vários jogos tem cronômetros:" en="Many games have timers in different types:" />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <TimedTimerBar duration={120} onExpire={() => {}} />
        <TimedTimerClock duration={120} onExpire={() => {}} />
        <TimedButton duration={120} onExpire={() => {}}>
          Testando...
        </TimedButton>
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ver todos os 3 cronômetros mudando a medida do tempo?',
          en: 'Are you able to see all 3 timers changing as time goes by?',
        }}
      />
    </Space>
  );
}
