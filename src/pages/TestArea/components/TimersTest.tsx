// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
import { TimedTimerBar, TimedTimerClock } from 'components/timers';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function TimersTest({ onResult, step }: TestStepProps) {
  return (
    <SpaceContainer className="full-width" vertical>
      <Title level={2} size="small">
        <Translate pt="Cronômetros" en="Timers" />
      </Title>

      <Instruction contained>
        <Translate pt="Vários jogos tem cronômetros:" en="Many games have timers in different types:" />
      </Instruction>

      <SpaceContainer wrap className="full-width" vertical>
        <TimedTimerBar duration={120} onExpire={() => {}} />
        <TimedTimerClock duration={120} onExpire={() => {}} />
        <TimedButton duration={120} onExpire={() => {}}>
          Testando...
        </TimedButton>
      </SpaceContainer>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você consegue ver todos os 3 cronômetros mudando a medida do tempo?',
          en: 'Are you able to see all 3 timers changing as time goes by?',
        }}
      />
    </SpaceContainer>
  );
}
