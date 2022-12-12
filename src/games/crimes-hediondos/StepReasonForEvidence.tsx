import { useState } from 'react';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { SceneTile } from './components/SceneTile';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';
import { Space } from 'antd';
import { ResetButton } from './components/ResetButton';

type StepReasonForEvidenceProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  reasonForEvidenceTile: SceneTile;
  goToStep: GenericFunction;
} & AnnouncementProps;

export function StepReasonForEvidence({
  announcement,
  items,
  selections,
  updateSelections,
  reasonForEvidenceTile,
  goToStep,
}: StepReasonForEvidenceProps) {
  const [reasonForEvidenceIndex, setReasonForEvidenceIndex] = useState<number>();

  const onSelectItem = (payload: SceneTilePayload) => {
    setReasonForEvidenceIndex(payload.value);
  };

  return (
    <Step announcement={announcement}>
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
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={reasonForEvidenceIndex === undefined}
          onClick={() => updateSelections({ reasonForEvidence: reasonForEvidenceIndex })}
        />
      </Space>
    </Step>
  );
}
