import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Alert, Divider, Flex } from 'antd';
// Types
import { Item } from 'types/tdr';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { DiagramArea } from '../utils/types';
import { SelectedAreasCircles } from './SelectedAreasCircles';
import { TripleDiagram } from './TripleDiagram/TripleDiagram';
import { TripleDiagramClickableAreas } from './TripleDiagram/TripleDiagramClickableAreas';
import {
  AreaPlacedItems,
  calculateProportionalValues,
  getCenterPointInArea,
} from './TripleDiagram/AreaPlacedItems';

type DiagramSectionProps = {
  width: number;
  onSelectArea?: (area: string) => void;
  items: Dictionary<Item>;
  diagrams: Dictionary<DiagramArea>;
  currentItem?: Item;
  currentItemPosition?: string;
};

export function DiagramSection({
  width,
  onSelectArea,
  diagrams,
  items,
  currentItem,
  currentItemPosition,
}: DiagramSectionProps) {
  const [selectedArea, setSelectedArea] = useState<string>('');

  const onAreaClick = (area: string) => {
    setSelectedArea(area);
    if (onSelectArea) {
      onSelectArea(area);
    }
  };

  const hasAnAreaSelected = !!selectedArea;

  const containerSizes = calculateProportionalValues(width, 0, 0);

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
            />
          </>
        )}
      </Instruction>
      <Instruction contained className="diagram-section__world">
        <TripleDiagram width={width} />
        {Object.values(diagrams).map((diagramArea) => (
          <AreaPlacedItems
            key={diagramArea.key}
            areaKey={diagramArea.key}
            diagramArea={diagramArea}
            containerWidth={width}
          />
        ))}
        <TripleDiagramClickableAreas width={width} onClick={onAreaClick} />
        {!!currentItem && (
          <CurrentItem currentItem={currentItem} currentItemPosition={currentItemPosition} width={width} />
        )}
      </Instruction>
    </div>
  );
}

function CurrentItem({
  currentItem,
  currentItemPosition,
  width,
}: Pick<DiagramSectionProps, 'currentItem' | 'currentItemPosition' | 'width'>) {
  const floatingItemSizes = calculateProportionalValues(width, 410, 360);

  if (!currentItem) return <></>;

  return (
    <div
      className={clsx('floating-item', !currentItemPosition && 'floating-item--animated')}
      style={
        currentItemPosition
          ? getCenterPointInArea(width, currentItemPosition)
          : { top: floatingItemSizes.y - 50, left: floatingItemSizes.x - 50 }
      }
    >
      <ItemCard
        id={currentItem.id}
        width={100}
        className={clsx(
          'floating-item__item',
          currentItemPosition && 'floating-item__item--selection',
          currentItemPosition && getAnimationClass('pulse', { infinite: true })
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
};

function SelectedAreaItemsSection({
  selectedArea,
  items,
  diagrams,
  maxHeight,
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
};

function SelectedAreaItems({ areaKey, itemsIds, items, displayEmptyMessage }: SelectedAreaItemsProps) {
  if (itemsIds.length === 0 && !displayEmptyMessage) return <></>;

  return (
    <>
      <div>
        <SelectedAreasCircles selectedArea={areaKey} />
      </div>

      <Flex justify="center" align="center" gap={6} wrap="wrap">
        {itemsIds.map((itemId) => (
          <ItemCard key={itemId} id={itemId} width={100} text={items[itemId].name} />
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
      <Divider style={{ margin: `6px 0` }} />
    </>
  );
}
