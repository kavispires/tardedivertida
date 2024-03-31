import { Flex } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { useState } from 'react';
import { Item } from 'types/tdr';

import { DiagramArea } from '../utils/types';
import { SelectedAreasCircles } from './SelectedAreasCircles';
import { AreaPlacedItems, calculateProportionalValues } from './TripleDiagram/AreaPlacedItems';
import { TripleDiagram } from './TripleDiagram/TripleDiagram';
import { TripleDiagramClickableAreas } from './TripleDiagram/TripleDiagramClickableAreas';

type DiagramSectionProps = {
  width: number;
  onSelectArea?: (area: string) => void;
  items: Dictionary<Item>;
  diagrams: Dictionary<DiagramArea>;
  currentItem?: Item;
};

export function DiagramSection({ width, onSelectArea, diagrams, items, currentItem }: DiagramSectionProps) {
  const [selectedArea, setSelectedArea] = useState<string>('');

  const onAreaClick = (area: string) => {
    setSelectedArea(area);
    if (onSelectArea) {
      onSelectArea(area);
    }
  };

  const hasAnAreaSelected = !!selectedArea;

  const selectedAreaItems = hasAnAreaSelected ? diagrams[selectedArea].itemsIds : [];

  const floatingItemSizes = calculateProportionalValues(width, 410, 360);
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
                <Translate pt="Área Selecionada" en="Selected Area" />
              )}
              <br />
              <SelectedAreasCircles selectedArea={selectedArea} />
            </Title>
            <Flex
              justify="center"
              align="center"
              gap={6}
              wrap="wrap"
              style={{ maxHeight: containerSizes.height, overflowY: 'auto' }}
            >
              {selectedAreaItems.map((itemId) => (
                <ItemCard key={itemId} id={itemId} width={100} text={items[itemId].name} />
              ))}
              {selectedAreaItems.length === 0 && (
                <Translate
                  pt="Nenhuma coisa foi colocada nessa seção"
                  en="No thing has been placed in this section"
                />
              )}
            </Flex>
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
          <div
            className="floating-item"
            style={{ top: floatingItemSizes.y - 50, left: floatingItemSizes.x - 50 }}
          >
            <ItemCard
              id={currentItem.id}
              width={100}
              // text={currentItem?.name}
              className="floating-item__item"
            />
          </div>
        )}
      </Instruction>
    </div>
  );
}
