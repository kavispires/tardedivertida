import { useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
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
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { GroupedItems, ItemsDict, SubmitCrimePayload } from './utils/types';
import { ContinueButton } from './components/ContinueButton';
import { EvidenceHighlight, WeaponHighlight } from './components/Highlights';

type StepItemsSelectionProps = {
  user: GamePlayer;
  groupedItems: GroupedItems;
  items: ItemsDict;
  selections: SubmitCrimePayload;
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
  const [weaponId, setWeaponId] = useState<string>(selections.weaponId ?? '');
  const [evidenceId, setEvidenceId] = useState<string>(selections.evidenceId ?? '');
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
              <strong>Selecione</strong> uma carta azul que representa o meio que a morte aconteceu no seu
              último crime, normalmente uma arma.
              <br />E <strong>selecione</strong> uma carta vermelha que um objeto na cena do crime.
              <br />O jogo contém <WeaponHighlight>16 meios</WeaponHighlight> e{' '}
              <EvidenceHighlight>16 evidências</EvidenceHighlight>, mas para essa parte, você vê apenas 4
              opções de cada.
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
                isSelected={[weaponId, evidenceId].includes(itemId)}
              />
            </TransparentButton>
          </li>
        ))}
      </ul>

      <SpaceContainer>
        <Button onClick={onRandomSelect} size="large">
          <Translate pt="Selecionar aleatoriamente" en="Random picks" />
        </Button>

        <ContinueButton
          disabled={!weaponId || !evidenceId}
          onClick={() => updateSelections({ weaponId, evidenceId })}
        />
      </SpaceContainer>
    </Step>
  );
}
