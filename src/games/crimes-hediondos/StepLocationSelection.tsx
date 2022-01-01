import { Button } from 'antd';
import { useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { ItemsBoard } from './ItemsBoard';
import { SceneTile } from './SceneTile';

type StepLocationSelectionProps = {
  items: Items;
  selections: PlainObject;
  updateSelections: GenericFunction;
  locationTiles: SceneTile[];
};

export function StepLocationSelection({
  items,
  selections,
  updateSelections,
  locationTiles,
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
              Os locais estão separados em 4 grupos. Apenas os grupos com pelo menos uma opção selecionada
              pelos jogadores será usada durante jogo.
              <br />
              Como é importante saber os outros objetos no jogo, agora você pode ver todos.
            </>
          }
          en={
            <>
              Based on any card (or both), select where the crime occurred. Remember you are trying to help
              the players guess your crime, so be smart!
              <br />
              The places are split in 4 groups. Only the groups with at least one option selected by the
              players will be present in the game.
              <br />
              Since it's important to know the other items in the game, here they are.
            </>
          }
        />
      </Instruction>

      <ItemsBoard items={items} weaponId={selections.weaponId} evidenceId={selections.evidenceId} />

      <div className="h-scene-tiles-list">
        {locationTiles.map((tile) => (
          <SceneTile
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
