import clsx from 'clsx';
import { Region, TextRegion } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Flex, Layout, Modal, Space } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { DailyGroupingGameIcon } from 'icons/DailyGroupingGameIcon';
// Components
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyQuartetosEntry } from '../utils/types';
import { useQuartetosEngine } from '../utils/useQuartetosEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
// Icons

type DailyQuartetosProps = {
  data: DailyQuartetosEntry;
  currentUser: Me;
};

export function DailyQuartetos({ data }: DailyQuartetosProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    grid,
    matches,
    guesses,
    selection,
    onSelectItem,
    onDeselectAll,
    onShuffle,
    onSubmit,
    latestAttempt,
  } = useQuartetosEngine(data, initialState);
  const [width, ref] = useCardWidthByContainerRef(4, { margin: 48, gap: 12, maxWidth: 96, minWidth: 55 });

  const shouldShakeScreen = latestAttempt && !isComplete && guesses.length > 0;

  return (
    <Layout className="app">
      <Header icon={<DailyGroupingGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={ref}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules date={data.id} />}
        />

        <TextRegion>
          <Instruction contained noMargin>
            <Translate pt="Faça quatro grupos de quatro" en="Connect four groups of four" />
          </Instruction>
        </TextRegion>

        <Region>
          {matches.map((match) => {
            return (
              <div key={match.id} className={clsx('set-match', `set-match--set-${match.level}`)}>
                <div className="set-title">{match.title}</div>
                <div className={clsx('grid')}>
                  {match.itemsIds.map((itemId) => (
                    <div key={itemId} className="set-match-item">
                      <ItemCard key={itemId} id={itemId} className="transparent" width={width} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div
            key={latestAttempt}
            className={clsx('grid', shouldShakeScreen ? getAnimationClass('shakeX') : '')}
          >
            {grid.map((itemId) => (
              <TransparentButton
                key={itemId}
                onClick={() => onSelectItem(itemId)}
                className={clsx('grid-item', { 'grid-item--selected': selection.includes(itemId) })}
              >
                <ItemCard id={itemId} className="transparent" width={width} />
              </TransparentButton>
            ))}
          </div>
        </Region>

        {isComplete ? (
          <Space className="results-container" direction="vertical" align="center" size="large">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        ) : (
          <Region>
            <Flex justify="center" gap={8}>
              <Button shape="round" onClick={onShuffle} disabled={grid.length === 0}>
                <Translate en="Shuffle" pt="Embaralhar" />
              </Button>
              <Button shape="round" onClick={onDeselectAll} disabled={!selection.length}>
                <Translate en="Deselect" pt="Desmarcar" />
              </Button>
              <Button shape="round" type="primary" onClick={onSubmit} disabled={selection.length !== 4}>
                <Translate en="Submit" pt="Enviar" />
              </Button>
            </Flex>
          </Region>
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            guesses={guesses}
            sets={data.sets}
            hearts={hearts}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
