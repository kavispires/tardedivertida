import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { Button, FloatButton, Layout, Modal, Space, Switch, Typography } from 'antd';
// Utils
import { getAnimation } from 'utils/animations';
import { isDevEnv } from 'utils/helpers';
// Icons
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TimerBar } from 'components/timers';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyAquiOEntry } from '../utils/types';
import { useAquiOEngine } from '../utils/useAquiOEngine';
import { getInitialState } from '../utils/helpers';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { Disc } from './Disc';
import { PreloadItems } from './PreloadItems';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyAquiOProps = {
  data: DailyAquiOEntry;
};

export function DailyAquiO({ data }: DailyAquiOProps) {
  const [initialState] = useState(getInitialState(data));

  const {
    hearts,
    showResultModal,
    setShowResultModal,
    discIndex,
    isWin,
    isLose,
    isComplete,
    onStart,
    onSelect,
    timeLeft,
    mode,
    onModeChange,
    discA,
    discB,
    result,
    isPlaying,
    attempts,
    maxProgress,
  } = useAquiOEngine(data, initialState);

  // UI state
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const [headerRef, headerMeasure] = useMeasure<HTMLDivElement>();
  const discWidth = useMemo(() => {
    const width = contentMeasure.width - 24;
    const height = (contentMeasure.height - headerMeasure.height) / 2 - 24;
    return Math.max(Math.min(width, height, 450), 150);
  }, [contentMeasure.height, contentMeasure.width, headerMeasure.height]);

  return (
    <Layout className="app">
      <Header
        icon={<DailyFindingGameIcon />}
        localStorageKey={SETTINGS.KEY}
      >
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <DailyContent ref={contentRef}>
        <div ref={headerRef}>
          <Menu
            hearts={hearts}
            total={SETTINGS.HEARTS}
            openRules={true}
            rules={<Rules date={data.id} />}
          />
          <SpaceContainer>
            <Typography.Text strong>
              <DualTranslate>{data.title}</DualTranslate> |{' '}
              <Translate
                pt="Disco"
                en="Disc"
              />{' '}
              {discIndex}/{SETTINGS.GOAL} |{' '}
              <Translate
                pt="Tentativa"
                en="Attempt"
              />{' '}
              {attempts}
            </Typography.Text>
          </SpaceContainer>

          <div className="full-width padding">
            <TimerBar
              value={timeLeft}
              total={60}
            />
          </div>
        </div>

        {isComplete && (
          <Space
            className="results-container"
            align="center"
            orientation="vertical"
          >
            <Button onClick={() => setShowResultModal(true)}>
              <Translate
                pt="Ver Resultado"
                en="Show Results"
              />
            </Button>
          </Space>
        )}

        <SpaceContainer orientation="vertical">
          {!isPlaying && (
            <>
              <Button
                size="large"
                onClick={onStart}
                type="primary"
                disabled={isWin || isLose}
                icon="🔘"
              >
                <Translate
                  pt="Começar"
                  en="Start"
                />
                &nbsp;
                <Translate
                  pt=" Diário"
                  en=" Daily"
                />
              </Button>

              <Switch
                unCheckedChildren={
                  <Translate
                    pt="Modo Normal"
                    en="Normal Mode"
                  />
                }
                checkedChildren={
                  <Translate
                    pt="Modo Difícil"
                    en="Challenge Mode"
                  />
                }
                value={mode === 'challenge'}
                onChange={(checked) => onModeChange(checked ? 'challenge' : 'normal')}
              />

              <PreloadItems items={data.itemsIds} />
            </>
          )}

          {isPlaying && (
            <SpaceContainer orientation="vertical">
              <Disc
                disc={discA}
                onSelect={onSelect}
                key={discA.id}
                width={discWidth}
                discProps={{
                  animate: 'animate',
                  variants: getAnimation('slideInUp', { speed: 'normal', ease: 'anticipate' }),
                }}
              />
              <Disc
                disc={discB}
                onSelect={onSelect}
                key={discB.id}
                width={discWidth}
                discProps={{
                  animate: 'animate',
                  variants: getAnimation('zoomIn', { speed: 'fast', delay: 0.2 }),
                }}
              />
            </SpaceContainer>
          )}
          {isPlaying && <DevResult result={result} />}

          <Modal
            open={showResultModal}
            onCancel={() => setShowResultModal(false)}
            footer={null}
          >
            <ResultsModalContent
              challengeNumber={data.number}
              challengeTitle={data.title}
              hearts={hearts}
              attempts={attempts}
              progress={discIndex}
              itemsIds={data.itemsIds}
              hardMode={mode === 'challenge'}
              lastMatch={result}
              maxProgress={maxProgress}
              isWin={isWin}
              isLose={isLose}
            />
          </Modal>
        </SpaceContainer>
      </DailyContent>
    </Layout>
  );
}

function DevResult({ result }: { result: string }) {
  if (!isDevEnv) return null;

  return (
    <FloatButton
      shape="square"
      icon={
        <ItemCard
          itemId={result}
          width={50}
          padding={0}
          className="raw-item"
        />
      }
    />
  );
}
