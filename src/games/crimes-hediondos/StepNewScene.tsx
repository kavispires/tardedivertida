import { Button, Collapse } from 'antd';
import { useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { Crime } from './Crime';
import { GroupedItemsBoard } from './GroupedItemsBoard';
import { SceneTile } from './SceneTile';

type StepNewSceneProps = {
  user: GamePlayer;
  items: ItemsDict;
  groupedItems: GroupedItems;
  onSubmitMark: GenericFunction;
  sceneTile: SceneTile;
  crimes: Crime[];
  scenes: ScenesDict;
  scenesOrder: string[];
  players: GamePlayers;
};

export function StepNewScene({
  user,
  items,
  groupedItems,
  onSubmitMark,
  sceneTile,
  crimes,
  players,
  scenes,
  scenesOrder,
}: StepNewSceneProps) {
  const [sceneMarkIndex, setSceneMarkIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setSceneMarkIndex(payload.value);
  };

  const itemsList = Object.values(items);
  const crime = crimes.find((crime) => crime.playerId === user.id);

  return (
    <Step>
      <Title>
        <Translate pt="Dê mais detalhes do crime" en="Give us more details" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Baseado em suas cartas, selecione uma opção na nova carta de detalhes da Cena do Crime abaixo.
            </>
          }
          en={<>Based on your cards, select an option in the new Scene card below.</>}
        />
      </Instruction>

      <Collapse>
        <Collapse.Panel
          key="weapons-evidences"
          header={<Translate pt="Ver todas Armas e Evidências" en="See all Weapons and Evidence" />}
        >
          <GroupedItemsBoard
            groupedItems={groupedItems}
            items={items}
            weaponId={user.weaponId}
            evidenceId={user.evidenceId}
          />
        </Collapse.Panel>
      </Collapse>

      <div className="">
        <Crime
          key={`crime-by-${crime!.playerId}`}
          crime={crime!}
          players={players}
          scenes={scenes}
          scenesOrder={scenesOrder}
          weapons={itemsList}
          evidences={itemsList}
          selections={{
            weaponId: crime!.weaponId,
            evidenceId: crime!.evidenceId,
            isComplete: true,
          }}
        />
      </div>

      <SceneTile tile={sceneTile} onSelectValue={onSelectItem} index={sceneMarkIndex} />

      <ButtonContainer>
        <Button
          type="primary"
          size="large"
          disabled={sceneMarkIndex === undefined}
          onClick={() => onSubmitMark({ sceneIndex: sceneMarkIndex })}
        >
          <Translate pt="Enviar" en="Send" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
