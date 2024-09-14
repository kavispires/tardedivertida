import { Button, Divider, FloatButton, Layout, Modal, Space, Switch, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { TimerBar } from 'components/timers';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
import { useMemo } from 'react';
import { useMeasure } from 'react-use';
import { getAnimationClass, isDevEnv } from 'utils/helpers';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyAquiOEntry } from '../utils/types';
import { useAquiOEngine } from '../utils/useAquiOEngine';
import { Disc } from './Disc';
import { PreloadItems } from './PreloadItems';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { getInitialState } from '../utils/helpers';

type DailyAquiOProps = {
  data: DailyAquiOEntry;
  language: Language;
  onToggleGame: () => void;
  isRandomGame: boolean;
};

export function DailyAquiO({ data, language, onToggleGame, isRandomGame }: DailyAquiOProps) {
  const initialState = useMemo(() => getInitialState(data, isRandomGame), [isRandomGame]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setMode,
    discA,
    discB,
    result,
    isPlaying,
    attempts,
    maxProgress,
  } = useAquiOEngine(data, initialState, isRandomGame);

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
      <Header icon={<DailyFindingGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={contentRef}>
        <div ref={headerRef}>
          <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />
          <Space className="space-container">
            <Typography.Text strong>
              {data.title[language]} | <Translate pt="Disco" en="Disc" /> {discIndex}/{SETTINGS.GOAL}
              {!isRandomGame && (
                <>
                  {' '}
                  | <Translate pt="Tentativa" en="Attempt" /> {attempts}
                </>
              )}
            </Typography.Text>
          </Space>

          <div className="full-width padding">
            <TimerBar value={timeLeft} total={60} />
          </div>
        </div>

        <Space className="space-container" direction="vertical">
          {!isPlaying && (
            <>
              <Button
                size="large"
                onClick={onStart}
                type="primary"
                disabled={isRandomGame ? false : isWin || isLose}
                icon="🔘"
              >
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

          {isComplete && (
            <Space className="results-container" align="center" direction="vertical">
              <Button onClick={() => setShowResultModal(true)}>
                <Translate pt="Ver Resultado" en="Show Results" />
              </Button>
            </Space>
          )}

          {(isRandomGame || isComplete) && !isPlaying && (
            <Space className="results-container" align="center" direction="vertical">
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

          {isPlaying && (
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
              challengeNumber={data.number}
              hearts={hearts}
              attempts={attempts}
              progress={discIndex}
              itemsIds={data.itemsIds}
              isRandomGame={isRandomGame}
              hardMode={mode === 'challenge'}
              lastMatch={result}
              maxProgress={maxProgress}
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
