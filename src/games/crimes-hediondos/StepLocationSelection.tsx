import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { GroupedItems, ItemsDict, SceneTilePayload } from './utils/types';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';

type StepLocationSelectionProps = {
  user: GamePlayer;
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  locationTiles: CrimeSceneTile[];
  groupedItems: GroupedItems;
  goToStep: GenericFunction;
} & Pick<StepProps, 'announcement'>;

export function StepLocationSelection({
  announcement,
  user,
  items,
  selections,
  updateSelections,
  locationTiles,
  groupedItems,
  goToStep,
}: StepLocationSelectionProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });
  const [location, setLocation] = useState<PlainObject>();

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (payload: SceneTilePayload) => {
    setLocation(payload);
  };

  return (
    <Step announcement={announcement}>
      <Title>
        <Translate pt="Onde foi o crime?" en="Where was the crime?" />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado em qualquer uma das suas cartas (ou ambas), selecione o local onde o crime aconteceu.
              <br />
              Lembre-se que você está tentando ajudar os outros jogadores adivinhar o seu crime, seja
              inteligente!
            </>
          }
          en={
            <>
              Based on any card (or both), select where the crime occurred.
              <br />
              Remember you are trying to help the players guess your crime, so be smart!
            </>
          }
        />
      </RuleInstruction>

      <ul className="h-items-selection">
        {userItems.map((itemId) => (
          <li key={itemId} className="h-items-selection__item">
            <CrimeItemCard
              item={items[itemId]}
              cardWidth={cardWidth}
              preview={false}
              isSelected={[selections.weaponId, selections.evidenceId].includes(itemId)}
            />
          </li>
        ))}
      </ul>

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

      <Space className="space-container" align="center">
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={location?.tileId === undefined}
          onClick={() => updateSelections({ locationTile: location?.tileId, locationIndex: location?.value })}
        />
      </Space>
    </Step>
  );
}
