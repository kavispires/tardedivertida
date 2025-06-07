import { Region, TextRegion } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Icons
import { DailyMemoryGridGameIcon } from 'icons/DailyMemoryGridGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyOrganikuEntry } from '../utils/types';
import { useOrganikuEngine } from '../utils/useOrganikuEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { TableGrid } from './TableGrid';

type DailyOrganikuProps = {
  data: DailyOrganikuEntry;
  currentUser: Me;
};

export function DailyOrganiku({ data }: DailyOrganikuProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    revealed,
    activeTileIndex,
    pairActiveTileIndex,
    foundCount,
    onActivateTile,
    flips,
  } = useOrganikuEngine(data, initialState);
  const [itemWidth, ref] = useCardWidthByContainerRef(5, { margin: 48, gap: 12, maxWidth: 96, minWidth: 55 });

  return (
    <Layout className="app">
      <Header icon={<DailyMemoryGridGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={ref}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text>
            <strong>{data.title}</strong> ({flips} <Translate pt="viradas" en="flips" />)
          </Typography.Text>
        </Region>

        <TextRegion>
          <Instruction contained noMargin>
            <Translate
              en={
                <>
                  Find pairs of images to reveal them.
                  <br />
                  There's only one type of symbol per row and column.
                </>
              }
              pt={
                <>
                  Ache pares de imagens para revelá-las.
                  <br />
                  Há apenas um tipo de símbolo por linha e coluna.
                </>
              }
            />
          </Instruction>
        </TextRegion>

        <Region>
          <TableGrid
            grid={data.grid}
            revealed={revealed}
            activeTileIndex={activeTileIndex}
            onSelectTile={isComplete ? () => {} : onActivateTile}
            foundCount={foundCount}
            itemWidth={itemWidth}
            defaultRevealedIndexes={data.defaultRevealedIndexes}
            pairActiveTileIndex={pairActiveTileIndex}
          />
        </Region>

        {isComplete && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            hearts={hearts}
            itemsIds={data.itemsIds}
            title={data.title}
            foundCount={foundCount}
            gridSize={Math.sqrt(data.grid.length)}
            flips={flips}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
