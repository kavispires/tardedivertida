import { useState } from 'react';
import { Space } from 'antd';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { SceneTile } from './components/SceneTile';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';

type StepCauseOfDeathSelectionProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  causeOfDeathTile: SceneTile;
};

export function StepCauseOfDeathSelection({
  items,
  selections,
  updateSelections,
  causeOfDeathTile,
}: StepCauseOfDeathSelectionProps) {
  const [causeOfDeathIndex, setCauseOfDeathIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setCauseOfDeathIndex(payload.value);
  };

  return (
    <Step>
      <Title>
        <Translate pt="Qual foi seu último crime?" en="How was your last crime?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>Baseado somente em sua arma do crime (carta azul), selecione a causa da morte de sua vítima.</>
          }
          en={<>Based solely on the weapon (blue card) you've chosen, select your victim's cause of death.</>}
        />
      </Instruction>

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
        <ContinueButton
          disabled={causeOfDeathIndex === undefined}
          onClick={() => updateSelections({ causeOfDeath: causeOfDeathIndex })}
        />
      </Space>
    </Step>
  );
}
