import { useState } from 'react';
// Components
import { Instruction, Step, Title, Translate } from 'components';
import { SceneTile } from './SceneTile';
import { SelectedItems } from './SelectedItems';
import { ContinueButton } from './ContinueButton';
import { Space } from 'antd';

type StepReasonForEvidenceProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  reasonForEvidenceTile: SceneTile;
};

export function StepReasonForEvidence({
  items,
  selections,
  updateSelections,
  reasonForEvidenceTile,
}: StepReasonForEvidenceProps) {
  const [reasonForEvidenceIndex, setReasonForEvidenceIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setReasonForEvidenceIndex(payload.value);
  };

  return (
    <Step>
      <Title>
        <Translate pt="Qual foi seu último crime?" en="How was your last crime?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              Baseado somente em seu objeto (carta vermelha), selecione o que o objeto significa para o crime.
            </>
          }
          en={
            <>Based solely on the object (red card) you've chosen, select the meaning of it to the crime.</>
          }
        />
      </Instruction>

      <Space className="space-container" align="center">
        <SelectedItems
          items={items}
          weaponId={selections.weaponId}
          evidenceId={selections.evidenceId}
          fadeWeapon
        />

        <SceneTile tile={reasonForEvidenceTile} onSelectValue={onSelectItem} index={reasonForEvidenceIndex} />
      </Space>

      <Space className="space-container" align="center">
        <ContinueButton
          disabled={reasonForEvidenceIndex === undefined}
          onClick={() => updateSelections({ reasonForEvidence: reasonForEvidenceIndex })}
        />
      </Space>
    </Step>
  );
}
