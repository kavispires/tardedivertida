import { useState } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimesHediondosCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { shuffle } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons';
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { GroupedItems, ItemsDict } from './utils/types';
import { ContinueButton } from './components/ContinueButton';
import { EvidenceHighlight, WeaponHighlight } from './components/Highlights';

type StepItemsSelectionProps = {
  user: GamePlayer;
  groupedItems: GroupedItems;
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
} & Pick<StepProps, 'announcement'>;

export function StepItemsSelection({
  announcement,
  user,
  items,
  groupedItems,
  selections,
  updateSelections,
}: StepItemsSelectionProps) {
  const [weaponId, setWeaponId] = useState<string>(selections.weaponId);
  const [evidenceId, setEvidenceId] = useState<string>(selections.evidenceId);
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (item: CrimesHediondosCard) => {
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
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Qual foi seu último crime?" en="How was your last crime?" />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Selecione uma carta azul e uma carta vermelha.
              <br />
              Elas representam a arma usada em seu último crime e um objeto da cena do crime.
              <br />O jogo contém <WeaponHighlight>16 armas</WeaponHighlight> e{' '}
              <EvidenceHighlight>16 objetos</EvidenceHighlight>, mas para essa parte, você vê apenas 4 opções
              de cada.
            </>
          }
          en={
            <>
              Select a blue card and a red card.
              <br />
              They represent the weapon used in your latest crime and an object that was in the crime scene.
              <br />
              The game has <WeaponHighlight>16 weapons</WeaponHighlight> and{' '}
              <EvidenceHighlight>16 objects</EvidenceHighlight>, but for this phase, you only see 4 options of
              each.
            </>
          }
        />
      </RuleInstruction>

      <ul className="h-items-selection">
        {userItems.map((itemId) => (
          <li key={itemId} className="h-items-selection__item">
            <TransparentButton onClick={() => onSelectItem(items[itemId])}>
              <CrimeItemCard
                item={items[itemId]}
                cardWidth={cardWidth}
                preview={false}
                isSelected={[weaponId, evidenceId].includes(itemId)}
              />
            </TransparentButton>
          </li>
        ))}
      </ul>

      <Space className="space-container" align="center">
        <Button onClick={onRandomSelect} size="large">
          <Translate pt="Selecionar aleatoriamente" en="Random picks" />
        </Button>

        <ContinueButton
          disabled={!weaponId || !evidenceId}
          onClick={() => updateSelections({ weaponId, evidenceId })}
        />
      </Space>
    </Step>
  );
}
