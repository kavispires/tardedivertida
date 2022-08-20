import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { shuffle } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from './components/ItemCard';
import { ContinueButton } from './components/ContinueButton';

type StepItemsSelectionProps = {
  user: GamePlayer;
  groupedItems: GroupedItems;
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
};

export function StepItemsSelection({
  user,
  items,
  groupedItems,
  selections,
  updateSelections,
}: StepItemsSelectionProps) {
  const [weaponId, setWeaponId] = useState<string>(selections.weaponId);
  const [evidenceId, setEvidenceId] = useState<string>(selections.evidenceId);
  const cardWidth = useCardWidth(12, 8, 50, 200);

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (item: HCard) => {
    if (item.type === 'weapon') {
      setWeaponId(item.id);
    } else {
      setEvidenceId(item.id);
    }
  };

  const onRandomSelect = () => {
    let randomWeaponId = '';
    let randomEvidenceId = '';
    shuffle(userItems).forEach((itemId) => {
      if (items[itemId].type === 'weapon') {
        randomWeaponId = itemId;
      } else {
        randomEvidenceId = itemId;
      }
    });
    setWeaponId(randomWeaponId);
    setEvidenceId(randomEvidenceId);
  };

  return (
    <Step>
      <Title>
        <Translate pt="Qual foi seu último crime?" en="How was your last crime?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Selecione uma carta azul e uma carta vermelha.
              <br />
              Elas representam a arma usada em seu último crime e um objeto da cena do crime.
              <br />O jogo contém 16 armas e 16 objetos, mas para essa parte, você vê apenas 4 opções de cada.
            </>
          }
          en={
            <>
              Select a blue card and a red card.
              <br />
              They represent the weapon used in your latest crime and an object that was in the crime scene.
              <br />
              The game has 16 weapons and 16 objects, but for this phase, you only see 4 options of each.
            </>
          }
        />
      </Instruction>

      <Space className="space-container" align="center">
        <Button onClick={onRandomSelect} size="large">
          <Translate pt="Selecionar aleatoriamente" en="Random picks" />
        </Button>

        <ContinueButton
          disabled={!weaponId || !evidenceId}
          onClick={() => updateSelections({ weaponId, evidenceId })}
        />
      </Space>

      <ul className="h-items-selection">
        {userItems.map((itemId) => (
          <li key={itemId} className="h-items-selection__item">
            <TransparentButton onClick={() => onSelectItem(items[itemId])}>
              <ItemCard
                item={items[itemId]}
                cardWidth={cardWidth}
                preview={false}
                isSelected={[weaponId, evidenceId].includes(itemId)}
              />
            </TransparentButton>
          </li>
        ))}
      </ul>
    </Step>
  );
}
