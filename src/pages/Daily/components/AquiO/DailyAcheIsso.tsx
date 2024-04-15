import { Button, Layout, Modal, Space, Typography } from 'antd';
import { Translate } from 'components/language';
import { CalendarIcon } from 'icons/CalendarIcon';
import { useEffect, useMemo, useState } from 'react';

import { Menu } from '../Common/Menu';
import { Header } from '../Common/Header';
import { SETTINGS } from './settings';
import { Card, PreloadItems } from './Card';
import { DailyAcheIssoEntry } from 'pages/Daily/utils/types';
import { intersectionBy } from 'lodash';
import { useMeasure } from 'react-use';
import { TimerBar } from 'components/timers';
import { useCountdown } from 'hooks/useCountdown';
import { inNSeconds } from 'utils/helpers';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyGameProps = {
  data: DailyAcheIssoEntry;
  language: Language;
};

export function DailyAcheIsso({ data, language }: DailyGameProps) {
  // Game state
  const [hearts, setHearts] = useState<number>(SETTINGS.HEARTS);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isComplete, setComplete] = useState<boolean>(false);

  // UI state
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const [headerRef, headerMeasure] = useMeasure<HTMLDivElement>();
  const cardWidth = useMemo(() => {
    const width = contentMeasure.width - 24;
    const height = (contentMeasure.height - headerMeasure.height) / 2 - 24;

    return Math.max(Math.min(width, height, 450), 150);
  }, [contentMeasure.height, contentMeasure.width, headerMeasure.height]);

  const { timeLeft, resume, isRunning, restart } = useCountdown({
    duration: 60,
    autoStart: false,
    onExpire: () => setComplete(true),
  });

  const onStart = () => {
    setCardIndex(0);
    if (isComplete) {
      setComplete(false);
      restart(inNSeconds(60), true);
    } else {
      resume();
    }
  };

  const cardA = data.cards[cardIndex];
  const cardB = data.cards[cardIndex + 1];
  const result = useMemo(() => intersectionBy(cardA.items, cardB.items, 'itemId')[0].itemId, [cardA, cardB]);
  const onSelect = (itemId: string) => {
    if (itemId === result) {
      setCardIndex(cardIndex + 1);
    } else {
      setHearts((prev) => prev - 1);
    }
  };

  // Controls auto result modal
  useEffect(() => {
    if (isComplete || hearts <= 0) {
      setShowResultModal(true);
    }
  }, [isComplete, hearts]); // eslint-disable-line react-hooks/exhaustive-deps

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
              {data.title[language]} | Level {cardIndex + 1}
            </Typography.Text>
          </Space>
          <div className="full-width padding">
            <TimerBar value={timeLeft} total={60} />
          </div>
        </div>
        <Space className="space-container" direction="vertical">
          {!isRunning && (
            <>
              <Button size="large" onClick={onStart} type="primary">
                <Translate pt="Começar" en="Start" />
              </Button>
              <PreloadItems items={data.itemIds} />
            </>
          )}

          {isRunning && (
            <Space className="space-container" direction="vertical">
              <Card card={cardA} onSelect={onSelect} key={cardA.id} width={cardWidth} />
              <Card card={cardB} onSelect={onSelect} key={cardB.id} width={cardWidth} />
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
              finished={isComplete}
              hearts={hearts}
              progress={cardIndex}
              itemsIds={data.itemIds}
            />
          </Modal>
        </Space>
      </Layout.Content>
    </Layout>
  );
}
