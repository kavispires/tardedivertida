import { useState } from 'react';
import { Button } from 'antd';
import { ButtonContainer, Instruction, Step, Title, Translate, TransparentButton } from 'components';
import { useCardWidth } from 'hooks';
import { shuffle } from 'utils/helpers';
import { ItemCard } from './ItemCard';
import { ContinueButton } from './ContinueButton';
// Ant Design Resources
// Hooks
// Utils
// Components

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
              Selecione uma arma do crime (carta azul) e um objeto (carta vermelha).
              <br />
              Elas representam a arma usada em seu último crime e um objeto da cena do crime.
              <br />O jogo contém 16 armas e 16 objetos, mas para essa parte, você vê apenas 4 opções de cada.
            </>
          }
          en={
            <>
              Select a weapon (blue card) and an object (red card).
              <br />
              They represent the weapon used in your latest crime and an object that was in the crime scene.
              <br />
              The game has 16 weapons and 16 objects, but for this phase, you only see 4 options of each.
            </>
          }
        />
      </Instruction>

      <ButtonContainer>
        <Button onClick={onRandomSelect}>
          <Translate pt="Selecionar aleatoriamente" en="Random picks" />
        </Button>

        <ContinueButton
          disabled={!weaponId || !evidenceId}
          onClick={() => updateSelections({ weaponId, evidenceId })}
        />
      </ButtonContainer>

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
