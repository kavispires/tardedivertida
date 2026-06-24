// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
import { TimedTimerBar } from '@components/timers/TimedTimerBar';
import { TimedTimerClock } from '@components/timers/TimedTimerClock';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function TimersTest({ onResult, step }: TestStepProps) {
  return (
    <SpaceContainer
      className="full-width"
      vertical
    >
      <Title
        level={2}
        size="small"
      >
        <Translate
          pt="Cronômetros"
          en="Timers"
        />
      </Title>

      <Surface contained>
        <Translate
          pt="Vários jogos tem cronômetros:"
          en="Many games have timers in different types:"
        />
      </Surface>

      <SpaceContainer
        wrap
        className="full-width"
        vertical
      >
        <TimedTimerBar
          duration={120}
          onExpire={() => {}}
        />
        <TimedTimerClock
          duration={120}
          onExpire={() => {}}
        />
        <TimedButton
          duration={120}
          onExpire={() => {}}
        >
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
