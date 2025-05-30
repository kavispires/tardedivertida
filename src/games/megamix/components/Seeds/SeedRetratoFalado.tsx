import arteRuimTimer from 'assets/sounds/arte-ruim-timer.mp3';
import { useEffect, useState } from 'react';
import { useAudio } from 'react-use';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Utils
import { NOOP } from 'utils/constants';
// Icons
import { PanicIcon } from 'icons/PanicIcon';
// Components
import { DrawingCanvas } from 'components/canvas';
import { MonsterCard } from 'components/cards/MonsterCard';
import { ImageCardPreloadHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import type { SeedEntryRetratoFalado } from '../../utils/types';
// Sound

type SeedRetratoFaladoProps = {
  seed: SeedEntryRetratoFalado;
  updateData: GenericComponent;
};

export function SeedRetratoFalado({ seed, updateData }: SeedRetratoFaladoProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);
  const [isTimesUp, setTimesUp] = useState(false);
  const [volume] = useGlobalLocalStorage('volume');
  const [audio, , controls] = useAudio({
    src: arteRuimTimer,
  });

  // Updated volume
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    controls.volume(volume);
  }, [volume]);

  const { seconds, start, isRunning } = useCountdown({
    duration: 33,
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
          pt="De repente, você se lembra de um evento muito traumático na sua vida, uma monstro te atacou uma vez..."
          en="Suddenly you have a glimpse of memory from the day a monster attacked you..."
        />
      </Title>

      <Space direction="vertical">
        <Instruction className="seed-instruction">
          <Translate
            pt={
              <>
                Você tem <strong>30 segundos</strong> para desenhar a carta abaixo.
                <br />
                Desenhá-lo é a única coisa que te acalma. Quando estiver pronto, aperte o botão!
              </>
            }
            en={
              <>
                You have <strong>30 seconds</strong> to draw the card below.
                <br />
                Drawing it is the only thing that calms you down. When you're ready, press the button!
              </>
            }
          />
        </Instruction>
        <Button onClick={start} type="primary" disabled={isRunning}>
          <Translate pt="Começar" en="Start" />
        </Button>

        {isRunning && audio}
        <div className="monster-container">
          {isRunning && <span className="a-draw__timer">{seconds > 1 ? seconds - 2 : 0}</span>}

          <MonsterCard
            currentMonster={isRunning ? seed.card : { id: 'md-bs-000', orientation: seed.card.orientation }}
            showControls
            cardWidth={250}
          />

          {isTimesUp ? (
            <PanicIcon style={{ background: 'white', width: '500px', padding: '2em' }} />
          ) : isRunning ? (
            <DrawingCanvas lines={lines} setLines={setLines} />
          ) : (
            <DrawingCanvas lines={[]} setLines={NOOP} />
          )}
        </div>
      </Space>

      <ImageCardPreloadHand hand={[seed.card.id]} />
    </div>
  );
}
