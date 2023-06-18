import { useState } from 'react';
// Ant Design Resources
import { Button, Collapse, Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Crime } from './components/Crime';
import { GroupedItemsBoard } from './components/GroupedItemsBoard';
import { SceneTile } from './components/SceneTile';
import { useLanguage } from 'hooks/useLanguage';

type StepNewSceneProps = {
  user: GamePlayer;
  items: ItemsDict;
  groupedItems: GroupedItems;
  onSubmitMark: GenericFunction;
  sceneTile: SceneTile;
  crimes: Crime[];
  scenes: ScenesDict;
  scenesOrder: string[];
} & AnnouncementProps;

export function StepNewScene({
  user,
  items,
  groupedItems,
  onSubmitMark,
  sceneTile,
  crimes,
  scenes,
  scenesOrder,
  announcement,
}: StepNewSceneProps) {
  const { language } = useLanguage();
  const [sceneMarkIndex, setSceneMarkIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setSceneMarkIndex(payload.value);
  };

  const crime = crimes.find((crime) => crime.playerId === user.id);

  return (
    <Step announcement={announcement}>
      <Title size="medium">{sceneTile.description[language]}</Title>
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
          header={
            <Translate
              pt="Clique para ver todas Armas e Evidências"
              en="Click to see all Weapons and Evidence"
            />
          }
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
          scenes={scenes}
          scenesOrder={scenesOrder}
          items={items}
          player={user}
          selectedWeaponId={user.weaponId}
          selectedEvidenceId={user.evidenceId}
        />
      </div>

      <SceneTile tile={sceneTile} onSelectValue={onSelectItem} index={sceneMarkIndex} />

      <Space className="space-container" align="center">
        <Button
          type="primary"
          size="large"
          disabled={sceneMarkIndex === undefined}
          onClick={() => onSubmitMark({ sceneIndex: sceneMarkIndex })}
        >
          <Translate pt="Enviar" en="Send" />
        </Button>
      </Space>
    </Step>
  );
}
