import { useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimesHediondosCard } from 'types/tdr';
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
import {
  EvidenceHighlight,
  LocationHighlight,
  VictimHighlight,
  WeaponHighlight,
} from './components/Highlights';

type StepItemsSelectionProps = {
  user: GamePlayer;
  groupedItems: GroupedItems;
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  isLocationGame: boolean;
  isVictimGame: boolean;
  cardWidth: number;
} & Pick<StepProps, 'announcement'>;

export function StepItemsSelection({
  announcement,
  user,
  items,
  groupedItems,
  selections,
  updateSelections,
  isLocationGame,
  isVictimGame,
  cardWidth,
}: StepItemsSelectionProps) {
  const [weaponId, setWeaponId] = useState<string>(selections.weaponId ?? '');
  const [evidenceId, setEvidenceId] = useState<string>(selections.evidenceId ?? '');
  const [locationId, setLocationId] = useState<string>(selections.locationId ?? '');
  const [victimId, setVictimId] = useState<string>(selections.victimId ?? '');

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (item: CrimesHediondosCard) => {
    if (item.type === 'weapon') {
      return setWeaponId(item.id);
    }
    if (item.type === 'evidence') {
      return setEvidenceId(item.id);
    }
    if (item.type === 'location') {
      return setLocationId(item.id);
    }
    if (item.type === 'victim') {
      return setVictimId(item.id);
    }
  };

  const onRandomSelect = () => {
    let randomWeaponId = '';
    let randomEvidenceId = '';
    let randomLocationId = '';
    let randomVictimId = '';
    shuffle(userItems).forEach((itemId) => {
      if (items[itemId].type === 'weapon') {
        randomWeaponId = itemId;
      }
      if (items[itemId].type === 'evidence') {
        randomEvidenceId = itemId;
      }
      if (items[itemId].type === 'location') {
        randomLocationId = itemId;
      }
      if (items[itemId].type === 'victim') {
        randomVictimId = itemId;
      }
    });
    setWeaponId(randomWeaponId);
    setEvidenceId(randomEvidenceId);
    setLocationId(randomLocationId);
    setVictimId(randomVictimId);
  };

  const getCountsInstructions = () => {
    const result = [
      <WeaponHighlight key="mean">
        <Translate pt="16 meios" en="16 means of murder" />
      </WeaponHighlight>,
      <EvidenceHighlight key="evidence">
        <Translate pt="16 evidências" en="16 pieces of evidence" />
      </EvidenceHighlight>,
    ];
    if (isVictimGame) {
      result.push(
        <VictimHighlight key="victim">
          <Translate pt="16 vítimas" en="16 victims" />
        </VictimHighlight>,
      );
    }
    if (isLocationGame) {
      result.push(
        <LocationHighlight key="location">
          <Translate pt="16 locais" en="16 locations" />
        </LocationHighlight>,
      );
    }

    return result;
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
              <br />
              <strong>Selecione</strong> uma carta vermelha que representa uma evidência que estava na cena do
              crime.
              {isVictimGame && (
                <>
                  <br />
                  <strong>Selecione</strong> uma carta amarela que representa a vítima do crime.
                </>
              )}
              {isLocationGame && (
                <>
                  <br />
                  <strong>Selecione</strong> uma carta verde que representa o local do crime.
                </>
              )}
              <br />O jogo contém {getCountsInstructions()}, mas para essa parte, você vê apenas 4 opções de
              cada.
            </>
          }
          en={
            <>
              <strong>Select</strong> a blue card that represents the means by which the death occurred in
              your last crime, usually a weapon.
              <br />
              <strong>Select</strong> a red card that represents evidence that was at the crime scene.
              {isVictimGame && (
                <>
                  <br />
                  <strong>Select</strong> a yellow card that represents the victim of the crime.
                </>
              )}
              {isLocationGame && (
                <>
                  <br />
                  <strong>Select</strong> a green card that represents the crime scene.
                </>
              )}
              <br />
              The game contains {getCountsInstructions()}, but for this part, you only see 4 options of each.
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
                isSelected={[weaponId, evidenceId, victimId, locationId].includes(itemId)}
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
          onClick={() => updateSelections({ weaponId, evidenceId, locationId, victimId })}
        />
      </SpaceContainer>
    </Step>
  );
}
