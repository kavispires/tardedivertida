import { Button, Space } from 'antd';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { useCountdown } from 'hooks/useCountdown';
import { Card } from 'components/cards';
import { DrawingCanvas } from 'components/canvas';
import { PanicIcon } from 'components/icons/PanicIcon';
import { useLanguage } from 'hooks/useLanguage';
import { useEffect, useState } from 'react';
import { NOOP } from 'utils/constants';
import { ArteRuimTimerSound } from 'components/audio/ArteRuimTimerSound';

type SeedArteRuimProps = {
  seed: SeedEntryArteRuim;
  updateData: GenericComponent;
};

export function SeedArteRuim({ seed, updateData }: SeedArteRuimProps) {
  const { translate } = useLanguage();
  const [lines, setLines] = useState<any>([]);
  const [isTimesUp, setTimesUp] = useState(false);

  const { seconds, start, isRunning } = useCountdown({
    duration: 13,
    autoStart: false,
    onExpire: () => {
      updateData(
        {
          [seed.card.id]: JSON.stringify(lines),
        },
        true
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
      <Title size="xx-small">
        <Translate
          pt="Para ajudar aliviar o estresse de ser sensual na balada, você resolveu se expressar artisticamente"
          en="To help relieve the stress of being completely sexy in the club, you decided to express yourself through art"
        />
      </Title>

      <Space direction="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Você tem <strong>10 segundos</strong> para desenhar a carta abaixo. Quando estiver pronto,
                aperte o botão!
              </>
            }
            en={
              <>
                You have <strong>10 seconds</strong> to draw the card below. When you ready, press the button!
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
