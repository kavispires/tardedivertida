import { Button } from 'antd';
import { useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { GroupedItemsBoard } from './GroupedItemsBoard';
import { SceneTile } from './SceneTile';

type StepLocationSelectionProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  locationTiles: SceneTile[];
  groupedItems: GroupedItems;
};

export function StepLocationSelection({
  items,
  selections,
  updateSelections,
  locationTiles,
  groupedItems,
}: StepLocationSelectionProps) {
  const [location, setLocation] = useState<PlainObject>();

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
              <br />
              Como é importante saber os outros objetos no jogo, agora você pode ver todos.
            </>
          }
          en={
            <>
              Based on any card (or both), select where the crime occurred. Remember you are trying to help
              the players guess your crime, so be smart!
              <br />
              Since it's important to know the other items in the game, here they are.
            </>
          }
        />
      </Instruction>

      <GroupedItemsBoard
        items={items}
        weaponId={selections.weaponId}
        evidenceId={selections.evidenceId}
        groupedItems={groupedItems}
      />

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
