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

type StepAboutTheVictimProps = {
  user: GamePlayer;
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  victimTile: CrimeSceneTile;
  groupedItems: GroupedItems;
  goToStep: (step: number) => void;
  isVictimGame: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepAboutTheVictim({
  announcement,
  user,
  items,
  selections,
  updateSelections,
  victimTile,
  groupedItems,
  goToStep,
  isVictimGame,
}: StepAboutTheVictimProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });
  const [victimIndex, setVictimIndex] = useState<number>();

  const userItems = groupedItems[user.itemGroupIndex];

  const onSelectItem = (payload: SceneTilePayload) => {
    setVictimIndex(payload.value);
  };

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Quem foi a pobre alma que se foi?" en="Who was the poor soul that taken?" />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              {isVictimGame
                ? 'Baseado em sua carta da vítima (amarela), selecione  algo sobre quem morreu.'
                : 'Baseado em qualquer uma de suas cartas, selecione dicas sobre a vítima.'}
              <br />
              Lembre-se que você está tentando ajudar os outros jogadores adivinhar o seu crime, seja
              inteligente!
            </>
          }
          en={
            <>
              {isVictimGame
                ? 'Based on your victim card (yellow), select something about who died.'
                : 'Based on any of your cards, select hints about the victim.'}
              <br />
              Remember you are trying to help the players guess your crime, so be smart!
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        {isVictimGame ? (
          <SelectedItems
            items={items}
            weaponId={selections.weaponId ?? ''}
            evidenceId={selections.evidenceId ?? ''}
            victimId={selections.victimId ?? ''}
            locationId={selections.locationId ?? ''}
            highlight="victim"
          />
        ) : (
          <ul className="h-items-selection">
            {userItems.map((itemId) => (
              <li key={itemId} className="h-items-selection__item">
                <CrimeItemCard
                  item={items[itemId]}
                  cardWidth={cardWidth}
                  isSelected={Object.values(selections).includes(itemId)}
                />
              </li>
            ))}
          </ul>
        )}
        <SceneTile tile={victimTile} onSelectValue={onSelectItem} index={victimIndex} />
      </SpaceContainer>

      <SpaceContainer>
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={victimIndex === undefined}
          onClick={() => updateSelections({ victimIndex })}
        />
      </SpaceContainer>
    </Step>
  );
}
