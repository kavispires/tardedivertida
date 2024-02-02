import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { CrimeSceneTile } from 'types/tdr';
import type { ItemsDict, SceneTilePayload } from './utils/types';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { SceneTile } from '../../components/game/SceneTile';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';
import { WeaponHighlight } from './components/Highlights';

type StepCauseOfDeathSelectionProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  causeOfDeathTile: CrimeSceneTile;
  goToStep: GenericFunction;
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
      <Title>
        <Translate pt="Como foi seu último crime?" en="How was your last crime?" />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado somente em sua <WeaponHighlight>arma do crime (carta azul)</WeaponHighlight>, selecione
              a causa da morte de sua vítima.
            </>
          }
          en={
            <>
              Based solely on the <WeaponHighlight>weapon (blue card)</WeaponHighlight> you've chosen, select
              your victim's cause of death.
            </>
          }
        />
      </RuleInstruction>

      <Space className="space-container" align="center">
        <SelectedItems
          items={items}
          weaponId={selections.weaponId}
          evidenceId={selections.evidenceId}
          fadeEvidence
        />

        <SceneTile tile={causeOfDeathTile} onSelectValue={onSelectItem} index={causeOfDeathIndex} />
      </Space>

      <Space className="space-container" align="center">
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={causeOfDeathIndex === undefined}
          onClick={() => updateSelections({ causeOfDeath: causeOfDeathIndex })}
        />
      </Space>
    </Step>
  );
}
