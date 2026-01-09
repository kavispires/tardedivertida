import { useState } from 'react';
// Types
import type { CrimeSceneTile } from 'types/tdr';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { ItemsDict, SceneTilePayload, SubmitCrimePayload } from './utils/types';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';
import { WeaponHighlight } from './components/Highlights';
import { SceneTile } from '../../components/game/SceneTile';

type StepCauseOfDeathSelectionProps = {
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  causeOfDeathTile: CrimeSceneTile;
  goToStep: (step: number) => void;
} & Pick<StepProps, 'announcement'>;

export function StepCauseOfDeathSelection({
  announcement,
  items,
  selections,
  updateSelections,
  causeOfDeathTile,
  goToStep,
}: StepCauseOfDeathSelectionProps) {
  const [causeOfDeathIndex, setCauseOfDeathIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setCauseOfDeathIndex(payload.value);
  };

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate
          pt="Como foi seu último crime?"
          en="How was your last crime?"
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado somente no <WeaponHighlight>meio do crime (carta azul)</WeaponHighlight>, selecione a
              causa da morte de sua vítima.
            </>
          }
          en={
            <>
              Based solely on the <WeaponHighlight>mean of murder (blue card)</WeaponHighlight> you've chosen,
              select your victim's cause of death.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        <SelectedItems
          items={items}
          weaponId={selections.weaponId ?? ''}
          evidenceId={selections.evidenceId ?? ''}
          victimId={selections.victimId ?? ''}
          locationId={selections.locationId ?? ''}
          highlight="weapon"
        />

        <SceneTile
          tile={causeOfDeathTile}
          onSelectValue={onSelectItem}
          index={causeOfDeathIndex}
        />
      </SpaceContainer>

      <SpaceContainer>
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={causeOfDeathIndex === undefined}
          onClick={() => updateSelections({ causeOfDeathIndex })}
        />
      </SpaceContainer>
    </Step>
  );
}
