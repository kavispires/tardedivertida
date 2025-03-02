import { useState } from 'react';
// Types
import type { GamePlayer } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { GroupedItems, ItemsDict, SceneTilePayload, SubmitCrimePayload } from './utils/types';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';

type StepLocationSelectionProps = {
  user: GamePlayer;
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  locationTile: CrimeSceneTile;
  groupedItems: GroupedItems;
  goToStep: (step: number) => void;
} & Pick<StepProps, 'announcement'>;

export function StepLocationSelection({
  announcement,
  user,
  items,
  selections,
  updateSelections,
  locationTile,
  groupedItems,
  goToStep,
}: StepLocationSelectionProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });
  const [locationIndex, setLocationIndex] = useState<number>();

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (payload: SceneTilePayload) => {
    setLocationIndex(payload.value);
  };

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Onde foi o crime?" en="Where was the crime?" />
      </StepTitle>
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
              isSelected={[selections.weaponId, selections.evidenceId].includes(itemId)}
            />
          </li>
        ))}
      </ul>

      <div className="h-scene-tiles-list">
        <SceneTile tile={locationTile} onSelectValue={onSelectItem} index={locationIndex} />
      </div>

      <SpaceContainer>
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={locationIndex === undefined}
          onClick={() => updateSelections({ locationIndex })}
        />
      </SpaceContainer>
    </Step>
  );
}
