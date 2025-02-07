import { useEffect, useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { NOOP } from 'utils/constants';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { ArteRuimTimerSound } from 'components/audio/ArteRuimTimerSound';
import { DrawingCanvas } from 'components/canvas';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { Instruction, Title } from 'components/text';
// Internal
import type { SeedEntryArteRuim } from '../../utils/types';

type SeedArteRuimProps = {
  seed: SeedEntryArteRuim;
  updateData: GenericComponent;
};

export function SeedArteRuim({ seed, updateData }: SeedArteRuimProps) {
  const { translate } = useLanguage();
  const [lines, setLines] = useState<CanvasLine[]>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const { seconds, start, isRunning } = useCountdown({
    duration: 13,
    autoStart: false,
    onExpire: () => {
      updateData(
        {
          [seed.card.id]: JSON.stringify(lines),
        },
        true,
      );
    },
  });

  useEffect(() => {
    if (seconds === 2) {
      setTimesUp(true);
    }
  }, [seconds]);

  return (
    <div className="seed-container">
      <Title size="xx-small" colorScheme="light">
        <Translate
          pt="Para ajudar aliviar o estresse de ser sensual na balada, você resolveu se expressar artisticamente"
          en="To help relieve the stress of being incredibly hot in the club, you decided to express yourself through art"
        />
      </Title>

      <Space direction="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Você tem <TimeHighlight>10 segundos</TimeHighlight> para desenhar a carta abaixo. Quando
                estiver pronto, aperte o botão, o texto irá aparecer, então desenhe rápido!
              </>
            }
            en={
              <>
                You have <TimeHighlight>10 seconds</TimeHighlight> to draw the card below. When you're ready,
                press the button so the text will show up and then draw fast!
              </>
            }
          />
        </Instruction>
        <Button onClick={start} type="primary" disabled={isRunning}>
          <Translate pt="Começar" en="Start" />
        </Button>

        <Card size="large" header={translate('Desenhe', 'Draw')} className="a-draw__card" color="yellow">
          {isRunning ? (
            <>
              {seed.card.text}
              <span className="a-draw__timer">{seconds > 1 ? seconds - 2 : 0}</span>
            </>
          ) : (
            '?'
          )}
        </Card>
        {isRunning && <ArteRuimTimerSound />}
        {isTimesUp ? (
          <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
        ) : isRunning ? (
          <DrawingCanvas lines={lines} setLines={setLines} />
        ) : (
          <DrawingCanvas lines={[]} setLines={NOOP} />
        )}
      </Space>
    </div>
  );
}
