import { Button, Divider, FloatButton, Layout, Modal, Space, Switch, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { TimerBar } from 'components/timers';
import { useCountdown } from 'hooks/useCountdown';
import { CalendarIcon } from 'icons/CalendarIcon';
import { intersectionBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
import { getAnimationClass, inNSeconds, isDevEnv } from 'utils/helpers';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { getDiscs } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import { AquiODisc, DailyAquiOEntry } from '../utils/types';
import { Disc } from './Disc';
import { PreloadItems } from './PreloadItems';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyGameProps = {
  data: DailyAquiOEntry;
  language: Language;
  onToggleGame: () => void;
  isRandomGame: boolean;
};

export function DailyAquiO({ data, language, onToggleGame, isRandomGame }: DailyGameProps) {
  // Game state
  const [mode, setMode] = useState<'normal' | 'challenge'>('normal');
  const [discs, setDiscs] = useState<AquiODisc[]>([]);
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isComplete, setComplete] = useState<boolean>(false);

  // UI state
  const [discIndex, setCardIndex] = useState<number>(0);
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const [headerRef, headerMeasure] = useMeasure<HTMLDivElement>();
  const discWidth = useMemo(() => {
    const width = contentMeasure.width - 24;
    const height = (contentMeasure.height - headerMeasure.height) / 2 - 24;

    return Math.max(Math.min(width, height, 450), 150);
  }, [contentMeasure.height, contentMeasure.width, headerMeasure.height]);

  const { timeLeft, isRunning, restart, pause } = useCountdown({
    duration: 60,
    autoStart: false,
    onExpire: () => setComplete(true),
  });

  const onStart = () => {
    setDiscs(getDiscs(data, mode === 'challenge'));
    setCardIndex(0);
    if (isComplete) {
      setComplete(false);
      restart(inNSeconds(60), true);
    }
    restart(inNSeconds(60), true);
  };

  const win = discIndex === SETTINGS.GOAL;

  const discA = discs[discIndex];
  const discB = discs[discIndex + 1];

  const result = useMemo(
    () => intersectionBy(discA?.items ?? [], discB?.items ?? [], 'itemId')?.[0]?.itemId,
    [discA, discB]
  );

  const onSelect = (itemId: string) => {
    if (itemId === result) {
      setCardIndex(discIndex + 1);
    } else {
      setHearts((prev) => prev - 1);
    }
  };

  // Controls auto result modal
  useEffect(() => {
    if (win || isComplete || hearts <= 0) {
      setShowResultModal(true);
      pause();
    }
  }, [isComplete, hearts, win]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        <Translate pt="Aqui Ó" en="Find This" />
      </Header>
      <Layout.Content ref={contentRef}>
        <div ref={headerRef}>
          <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />
          <Space className="space-container">
            <Typography.Text strong>
              {data.title[language]} | <Translate pt="Disco" en="Disc" /> {discIndex}/{SETTINGS.GOAL}
            </Typography.Text>
          </Space>

          <div className="full-width padding">
            <TimerBar value={timeLeft} total={60} />
          </div>
        </div>

        <Space className="space-container" direction="vertical">
          {!isRunning && (
            <>
              <Button size="large" onClick={onStart} type="primary" disabled={hearts === 0} icon="🔘">
                <Translate pt="Começar" en="Start" />
                &nbsp;
                {isRandomGame ? (
                  <DualTranslate>{data.title}</DualTranslate>
                ) : (
                  <Translate pt=" Diário" en=" Daily" />
                )}
              </Button>
              <PreloadItems items={data.itemsIds} />

              <Switch
                unCheckedChildren={<Translate pt="Modo Normal" en="Normal Mode" />}
                checkedChildren={<Translate pt="Modo Difícil" en="Challenge Mode" />}
                value={mode === 'challenge'}
                onChange={(checked) => setMode(checked ? 'challenge' : 'normal')}
              />
            </>
          )}

          {(isComplete || hearts <= 0 || win) && (
            <Space className="results-container" align="center" direction="vertical">
              <Button onClick={() => setShowResultModal(true)}>
                <Translate pt="Ver Resultado" en="Show Results" />
              </Button>

              <Divider />

              <Button onClick={onToggleGame}>
                {isRandomGame ? (
                  <Translate pt="Jogar o Desafio Diário" en="Play the daily challenge" />
                ) : (
                  <Translate pt="Jogar com baralho aleatório" en="Play a random deck" />
                )}
              </Button>
            </Space>
          )}

          {isRunning && !win && (
            <Space className="space-container" direction="vertical">
              <Disc
                disc={discA}
                onSelect={onSelect}
                key={discA.id}
                width={discWidth}
                className={getAnimationClass('slideInUp', { speed: 'fast' })}
              />
              <Disc
                disc={discB}
                onSelect={onSelect}
                key={discB.id}
                width={discWidth}
                className={getAnimationClass('zoomIn', { speed: 'fast' })}
              />
              <DevResult result={result} />
            </Space>
          )}

          <Modal
            title={<Translate pt="Resultado" en="Results" />}
            open={showResultModal}
            onCancel={() => setShowResultModal(false)}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
          >
            <ResultsModalContent
              challengeTitle={data.title[language]}
              hearts={hearts}
              progress={discIndex}
              itemsIds={data.itemsIds}
              win={win}
              isRandomGame={isRandomGame}
            />
          </Modal>
        </Space>
      </Layout.Content>
    </Layout>
  );
}

function DevResult({ result }: { result: string }) {
  if (!isDevEnv) return <></>;

  return (
    <FloatButton shape="square" icon={<ItemCard id={result} width={50} padding={0} className="raw-item" />} />
  );
}
