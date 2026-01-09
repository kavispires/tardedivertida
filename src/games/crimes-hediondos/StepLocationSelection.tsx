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
import { SelectedItems } from './components/SelectedItems';

type StepLocationSelectionProps = {
  user: GamePlayer;
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  locationTile: CrimeSceneTile;
  groupedItems: GroupedItems;
  goToStep: (step: number) => void;
  isLocationGame: boolean;
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
  isLocationGame,
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
        <Translate
          pt="Onde foi o crime?"
          en="Where was the crime?"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              {isLocationGame
                ? 'Baseado em sua carta do local (verde), selecione uma dica de onde o crime aconteceu.'
                : 'Baseado em qualquer uma das suas cartas (ou ambas), selecione o local onde o crime aconteceu.'}
              <br />
              Lembre-se que você está tentando ajudar os outros jogadores adivinhar o seu crime, seja
              inteligente!
            </>
          }
          en={
            <>
              {isLocationGame
                ? 'Based on your location card (green), select a hint about where the crime happened.'
                : 'Based on any of your cards (or both), select the location where the crime happened.'}
              <br />
              Remember you are trying to help the players guess your crime, so be smart!
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        {isLocationGame ? (
          <SelectedItems
            items={items}
            weaponId={selections.weaponId ?? ''}
            evidenceId={selections.evidenceId ?? ''}
            victimId={selections.victimId ?? ''}
            locationId={selections.locationId ?? ''}
            highlight="location"
          />
        ) : (
          <ul className="h-items-selection">
            {userItems.map((itemId) => (
              <li
                key={itemId}
                className="h-items-selection__item"
              >
                <CrimeItemCard
                  item={items[itemId]}
                  cardWidth={cardWidth}
                  isSelected={Object.values(selections).includes(itemId)}
                />
              </li>
            ))}
          </ul>
        )}
        <SceneTile
          tile={locationTile}
          onSelectValue={onSelectItem}
          index={locationIndex}
        />
      </SpaceContainer>

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
