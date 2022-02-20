import { Button } from 'antd';
import { useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { useCardWidth } from '../../hooks';
import { ItemCard } from './ItemCard';
import { SceneTile } from './SceneTile';

type StepLocationSelectionProps = {
  user: GamePlayer;
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  locationTiles: SceneTile[];
  groupedItems: GroupedItems;
};

export function StepLocationSelection({
  user,
  items,
  selections,
  updateSelections,
  locationTiles,
  groupedItems,
}: StepLocationSelectionProps) {
  const cardWidth = useCardWidth(12, 8, 50, 200);
  const [location, setLocation] = useState<PlainObject>();

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (payload: SceneTilePayload) => {
    setLocation(payload);
  };

  return (
    <Step>
      <Title>
        <Translate pt="Onde foi o crime?" en="Where was the crime?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Baseado em qualquer uma das suas cartas (ou ambas), selecione o local onde o crime aconteceu.
              Lembre-se que você está tentando ajudar os outros jogadores adivinhar o seu crime, seja
              inteligente!
            </>
          }
          en={
            <>
              Based on any card (or both), select where the crime occurred. Remember you are trying to help
              the players guess your crime, so be smart!
            </>
          }
        />
      </Instruction>

      <ul className="h-items-selection">
        {userItems.map((itemId) => (
          <li key={itemId} className="h-items-selection__item">
            <ItemCard
              item={items[itemId]}
              cardWidth={cardWidth}
              preview={false}
              isSelected={[selections.weaponId, selections.evidenceId].includes(itemId)}
            />
          </li>
        ))}
      </ul>

      <div className="h-scene-tiles-list">
        {locationTiles.map((tile) => (
          <SceneTile
            key={tile.id}
            tile={tile}
            onSelectValue={onSelectItem}
            index={location?.tileId === tile.id ? location?.value : undefined}
          />
        ))}
      </div>

      <ButtonContainer>
        <Button
          type="primary"
          size="large"
          disabled={location?.tileId === undefined}
          onClick={() => updateSelections({ locationTile: location?.tileId, locationIndex: location?.value })}
        >
          »»»
        </Button>
      </ButtonContainer>
    </Step>
  );
}
