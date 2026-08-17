import clsx from 'clsx';
import { type ReactNode, useMemo, useState } from 'react';
// Ant Design Resources
import { Alert, Divider, Flex } from 'antd';
// Types
import type { ItemData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { CircleIcon } from '@icons/CircleIcon';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Icon } from '@components/general/Icon';
import { Popconfirm } from '@components/general/Popconfirm';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
// Internal
import type { DiagramArea, Reevaluation, Solutions } from '../utils/types';
import { checkIsDoubleDiagram } from '../utils/helper';
import { SelectedAreasCircles } from './SelectedAreasCircles';
import { TripleDiagram } from './TripleDiagram/TripleDiagram';
import { TripleDiagramClickableAreas } from './TripleDiagram/TripleDiagramClickableAreas';
import { TripleAreaPlacedItems, tripleHelpers } from './TripleDiagram/TripleAreaPlacedItems';
import { DoubleDiagram } from './DoubleDiagram/DoubleDiagram';
import { DoubleDiagramClickableAreas } from './DoubleDiagram/DoubleDiagramClickableAreas';
import { DoubleAreaPlacedItems, doubleHelpers } from './DoubleDiagram/DoubleAreaPlacedItems';
import { Thing } from './Thing';

type DiagramSectionProps = {
  width: number;
  onSelectArea?: (area: string) => void;
  items: Dictionary<ItemData>;
  diagrams: Dictionary<DiagramArea>;
  currentItem?: ItemData;
  currentItemPosition?: string;
  reevaluation?: Reevaluation;
  children: ReactNode;
  solutions?: Solutions;
};

export function DiagramSection({
  width,
  onSelectArea,
  diagrams,
  items,
  currentItem,
  currentItemPosition,
  reevaluation,
  children,
  solutions,
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
    <Surface>
      <div className="diagram-section">
        <Surface
          contained
          className="diagram-section__side-section"
        >
          <Title
            size="xx-small"
            colorScheme="light"
          >
            {selectedArea === 'O' ? (
              <Translate
                pt="Fora do Diagrama"
                en="Outside the Diagram"
              />
            ) : (
              <Translate
                pt="Coisas na área"
                en="Things in area"
              />
            )}
          </Title>
          {hasAnAreaSelected ? (
            <SelectedAreaItemsSection
              diagrams={diagrams}
              items={items}
              selectedArea={selectedArea}
              maxHeight={containerSizes.height}
              reevaluation={reevaluation}
              solutions={solutions}
            />
          ) : (
            <Surface contained>
              <Translate
                en="Select an area in the diagram to see the things in it"
                pt="Selecione uma área no diagrama para ver todas as coisas nele"
              />
            </Surface>
          )}
        </Surface>

        <Surface
          contained
          className="diagram-section__world"
          style={{ width: width + 12 }}
        >
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
              <DoubleDiagramClickableAreas
                width={width}
                onClick={onAreaClick}
              />
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
              <TripleDiagramClickableAreas
                width={width}
                onClick={onAreaClick}
              />
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
        </Surface>

        <Surface
          contained
          className="diagram-section__side-section"
        >
          {children}
        </Surface>
      </div>
    </Surface>
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
        width={64}
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
  items: Dictionary<ItemData>;
  selectedArea: string;
  maxHeight: number;
  reevaluation?: Reevaluation;
  solutions?: Solutions;
};

function SelectedAreaItemsSection({
  selectedArea,
  items,
  diagrams,
  maxHeight,
  reevaluation,
  solutions,
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
    <Flex
      vertical
      align="center"
      style={{ maxHeight: maxHeight, overflowY: 'auto' }}
      gap={6}
    >
      {areaKeys.map((areaKey, index) => (
        <SelectedAreaItems
          key={areaKey}
          areaKey={areaKey}
          itemsIds={areasItems[index]}
          items={items}
          displayEmptyMessage={index === 0}
          reevaluation={reevaluation}
          solutions={solutions}
        />
      ))}
    </Flex>
  );
}

type SelectedAreaItemsProps = {
  areaKey: string;
  itemsIds: string[];
  items: Dictionary<ItemData>;
  displayEmptyMessage: boolean;
  reevaluation?: Reevaluation;
  solutions?: Solutions;
};

function SelectedAreaItems({
  areaKey,
  itemsIds,
  items,
  displayEmptyMessage,
  reevaluation,
  solutions,
}: SelectedAreaItemsProps) {
  const { translate } = useLanguage();

  if (itemsIds.length === 0 && !displayEmptyMessage) return null;

  return (
    <>
      <div>
        <SelectedAreasCircles selectedArea={areaKey} />
      </div>

      <Flex
        justify="center"
        align="center"
        gap={6}
        wrap="wrap"
      >
        {solutions?.attribute && areaKey.includes('A') && (
          <Alert
            banner
            className="full-width"
            icon={
              <Icon
                icon={<CircleIcon mainColor="blue" />}
                size="small"
              />
            }
            type="info"
            title={solutions?.attribute.text}
          />
        )}
        {solutions?.word && areaKey.includes('W') && (
          <Alert
            icon={
              <Icon
                icon={<CircleIcon mainColor="yellow" />}
                size="small"
              />
            }
            banner
            className="full-width"
            type="warning"
            title={solutions?.word.text}
          />
        )}
        {solutions?.context && areaKey.includes('C') && (
          <Alert
            banner
            className="full-width"
            icon={
              <Icon
                icon={<CircleIcon mainColor="red" />}
                size="small"
              />
            }
            type="info"
            title={solutions?.context.text}
          />
        )}
        {itemsIds.map((itemId) => (
          <Popconfirm
            placement="right"
            disabled={!reevaluation?.isTheJudge}
            key={itemId}
            title={
              <Translate
                pt="Quer reavaliar essa coisa?"
                en="Do you want to reevaluate this thing?"
              />
            }
            onConfirm={() => reevaluation?.onOpenFixModal(itemId, areaKey)}
          >
            <div>
              <Thing
                itemId={itemId}
                width={84}
                name={translate(items[itemId].name)}
              />
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
            title={
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
