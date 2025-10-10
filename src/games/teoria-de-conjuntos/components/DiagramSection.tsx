import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Alert, Divider, Flex, Popconfirm } from 'antd';
// Types
import type { Item } from 'types/tdr';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import type { DiagramArea, Reevaluation } from '../utils/types';
import { checkIsDoubleDiagram } from '../utils/helper';
import { SelectedAreasCircles } from './SelectedAreasCircles';
import { TripleDiagram } from './TripleDiagram/TripleDiagram';
import { TripleDiagramClickableAreas } from './TripleDiagram/TripleDiagramClickableAreas';
import { TripleAreaPlacedItems, tripleHelpers } from './TripleDiagram/TripleAreaPlacedItems';
import { DoubleDiagram } from './DoubleDiagram/DoubleDiagram';
import { DoubleDiagramClickableAreas } from './DoubleDiagram/DoubleDiagramClickableAreas';
import { DoubleAreaPlacedItems, doubleHelpers } from './DoubleDiagram/DoubleAreaPlacedItems';

type DiagramSectionProps = {
  width: number;
  onSelectArea?: (area: string) => void;
  items: Dictionary<Item>;
  diagrams: Dictionary<DiagramArea>;
  currentItem?: Item;
  currentItemPosition?: string;
  reevaluation?: Reevaluation;
};

export function DiagramSection({
  width,
  onSelectArea,
  diagrams,
  items,
  currentItem,
  currentItemPosition,
  reevaluation,
}: DiagramSectionProps) {
  const doubleDiagram = checkIsDoubleDiagram(diagrams);

  const [selectedArea, setSelectedArea] = useState<string>('');

  const onAreaClick = (area: string) => {
    setSelectedArea(area);
    if (onSelectArea) {
      onSelectArea(area);
    }
  };

  const hasAnAreaSelected = !!selectedArea;

  const containerSizes = doubleDiagram
    ? doubleHelpers.calculateProportionalValues(width, 0, 0)
    : tripleHelpers.calculateProportionalValues(width, 0, 0);

  return (
    <div className="diagram-section">
      <Instruction contained={hasAnAreaSelected} className="diagram-section__selected-scope">
        {hasAnAreaSelected && (
          <>
            <Title size="xx-small">
              {selectedArea === 'O' ? (
                <Translate pt="Fora do Diagrama" en="Outside the Diagram" />
              ) : (
                <Translate pt="Coisas na área" en="Things in area" />
              )}
            </Title>
            <SelectedAreaItemsSection
              diagrams={diagrams}
              items={items}
              selectedArea={selectedArea}
              maxHeight={containerSizes.height}
              reevaluation={reevaluation}
            />
          </>
        )}
      </Instruction>
      <Instruction contained className="diagram-section__world">
        {doubleDiagram ? (
          <>
            <DoubleDiagram width={width} />
            {Object.values(diagrams).map((diagramArea) => (
              <DoubleAreaPlacedItems
                key={diagramArea.key}
                areaKey={diagramArea.key}
                diagramArea={diagramArea}
                containerWidth={width}
              />
            ))}
            <DoubleDiagramClickableAreas width={width} onClick={onAreaClick} />
          </>
        ) : (
          <>
            <TripleDiagram width={width} />
            {Object.values(diagrams).map((diagramArea) => (
              <TripleAreaPlacedItems
                key={diagramArea.key}
                areaKey={diagramArea.key}
                diagramArea={diagramArea}
                containerWidth={width}
              />
            ))}
            <TripleDiagramClickableAreas width={width} onClick={onAreaClick} />
          </>
        )}

        {!!currentItem && (
          <CurrentItem
            currentItem={currentItem}
            currentItemPosition={currentItemPosition}
            width={width}
            doubleDiagram={doubleDiagram}
          />
        )}
      </Instruction>
    </div>
  );
}

function CurrentItem({
  currentItem,
  currentItemPosition,
  width,
  doubleDiagram,
}: Pick<DiagramSectionProps, 'currentItem' | 'currentItemPosition' | 'width'> & { doubleDiagram: boolean }) {
  const helpers = doubleDiagram ? doubleHelpers : tripleHelpers;
  const floatingItemSizes = helpers.calculateProportionalValues(width, 410, doubleDiagram ? 324 : 360);

  if (!currentItem) return null;

  return (
    <div
      className={clsx('floating-item', !currentItemPosition && 'floating-item--animated')}
      style={
        currentItemPosition
          ? helpers.getCenterPointInArea(width, currentItemPosition)
          : { top: floatingItemSizes.y - 50, left: floatingItemSizes.x - 50 }
      }
    >
      <ItemCard
        itemId={currentItem.id}
        width={100}
        className={clsx(
          'floating-item__item',
          currentItemPosition && 'floating-item__item--selection',
          currentItemPosition && getAnimationClass('pulse', { infinite: true }),
        )}
      />
    </div>
  );
}

type SelectedAreaItemsSectionProps = {
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  selectedArea: string;
  maxHeight: number;
  reevaluation?: Reevaluation;
};

function SelectedAreaItemsSection({
  selectedArea,
  items,
  diagrams,
  maxHeight,
  reevaluation,
}: SelectedAreaItemsSectionProps) {
  const { areaKeys, areasItems } = useMemo(() => {
    if (selectedArea.length > 1 || selectedArea === 'O') {
      return {
        areaKeys: [selectedArea],
        areasItems: [diagrams[selectedArea].itemsIds],
      };
    }

    const areaKeys: string[] = [selectedArea];
    const areasItems = [diagrams[selectedArea].itemsIds];

    for (const [key, diagram] of Object.entries(diagrams)) {
      if (key !== selectedArea && key.includes(selectedArea)) {
        areaKeys.push(key);
        areasItems.push(diagram.itemsIds);
      }
    }

    return {
      areaKeys,
      areasItems,
    };
  }, [selectedArea, diagrams]);

  return (
    <Flex vertical align="center" style={{ maxHeight: maxHeight, overflowY: 'auto' }} gap={6}>
      {areaKeys.map((areaKey, index) => (
        <SelectedAreaItems
          key={areaKey}
          areaKey={areaKey}
          itemsIds={areasItems[index]}
          items={items}
          displayEmptyMessage={index === 0}
          reevaluation={reevaluation}
        />
      ))}
    </Flex>
  );
}

type SelectedAreaItemsProps = {
  areaKey: string;
  itemsIds: string[];
  items: Dictionary<Item>;
  displayEmptyMessage: boolean;
  reevaluation?: Reevaluation;
};

function SelectedAreaItems({
  areaKey,
  itemsIds,
  items,
  displayEmptyMessage,
  reevaluation,
}: SelectedAreaItemsProps) {
  if (itemsIds.length === 0 && !displayEmptyMessage) return null;

  return (
    <>
      <div>
        <SelectedAreasCircles selectedArea={areaKey} />
      </div>

      <Flex justify="center" align="center" gap={6} wrap="wrap">
        {itemsIds.map((itemId) => (
          <Popconfirm
            placement="right"
            disabled={!reevaluation?.isJudge}
            key={itemId}
            title={<Translate pt="Quer reavaliar essa coisa?" en="Do you want to reevaluate this thing?" />}
            onConfirm={() => reevaluation?.onOpenFixModal(itemId, areaKey)}
          >
            <div>
              <ItemCard key={itemId} itemId={itemId} width={84} text={items[itemId].name} />
            </div>
          </Popconfirm>
        ))}
        {itemsIds.length === 0 && displayEmptyMessage && (
          <Alert
            type={
              areaKey.includes('C')
                ? 'error'
                : areaKey.includes('A')
                  ? 'info'
                  : areaKey.includes('W')
                    ? 'warning'
                    : 'success'
            }
            message={
              <Translate
                pt="Nenhuma coisa foi colocada só nessa seção."
                en="No thing has been placed exclusively in this section."
              />
            }
          />
        )}
      </Flex>
      <Divider style={{ margin: '6px 0' }} />
    </>
  );
}
