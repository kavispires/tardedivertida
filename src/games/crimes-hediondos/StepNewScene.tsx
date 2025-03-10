import { useState } from 'react';
// Ant Design Resources
import { Collapse } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Components
import { SendButton } from 'components/buttons';
import { SceneTile } from 'components/game/SceneTile';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Crime, GroupedItems, ItemsDict, SceneTilePayload, ScenesDict } from './utils/types';
import { CrimeSummary } from './components/CrimeSummary';
import { GroupedItemsBoard } from './components/GroupedItemsBoard';

type StepNewSceneProps = {
  user: GamePlayer;
  items: ItemsDict;
  groupedItems: GroupedItems;
  onSubmitMark: GenericFunction;
  sceneTile: CrimeSceneTile;
  crimes: Crime[];
  scenes: ScenesDict;
  scenesOrder: string[];
} & Pick<StepProps, 'announcement'>;

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
  const [sceneMarkIndex, setSceneMarkIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setSceneMarkIndex(payload.value);
  };

  const crime = crimes.find((crime) => crime.playerId === user.id);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <DualTranslate>{sceneTile.description}</DualTranslate>
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado em suas cartas, selecione uma opção na nova carta de detalhes da Cena do Crime abaixo.
            </>
          }
          en={<>Based on your cards, select an option in the new Scene card below.</>}
        />
      </RuleInstruction>

      <Instruction contained>
        <Collapse
          items={[
            {
              key: 'weapons-evidences',
              label: (
                <Translate
                  pt="Clique para ver todas Armas e Evidências"
                  en="Click to see all Weapons and Evidence"
                />
              ),
              children: (
                <GroupedItemsBoard
                  groupedItems={groupedItems}
                  items={items}
                  weaponId={user.weaponId}
                  evidenceId={user.evidenceId}
                />
              ),
            },
          ]}
        />
      </Instruction>

      <div className="">
        {crime && (
          <CrimeSummary
            key={`crime-by-${crime.playerId}`}
            crime={crime}
            scenes={scenes}
            scenesOrder={scenesOrder}
            items={items}
            player={user}
            selectedWeaponId={user.weaponId}
            selectedEvidenceId={user.evidenceId}
          />
        )}
      </div>

      <SceneTile tile={sceneTile} onSelectValue={onSelectItem} index={sceneMarkIndex} />

      <SpaceContainer>
        <SendButton
          size="large"
          disabled={sceneMarkIndex === undefined}
          onClick={() => onSubmitMark({ sceneIndex: sceneMarkIndex })}
        >
          <Translate pt="Enviar" en="Send" />
        </SendButton>
      </SpaceContainer>
    </Step>
  );
}
