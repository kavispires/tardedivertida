import { useState } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { CrimeSceneTile } from 'types/tdr';
// Components
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { ItemsDict, SceneTilePayload } from './utils/types';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';
import { EvidenceHighlight } from './components/Highlights';

type StepReasonForEvidenceProps = {
  items: ItemsDict;
  selections: PlainObject;
  updateSelections: GenericFunction;
  reasonForEvidenceTile: CrimeSceneTile;
  goToStep: GenericFunction;
} & Pick<StepProps, 'announcement'>;

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
        <Translate pt="O que tinha no seu último crime?" en="What was in your last crime?" />
      </Title>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado somente em seu <EvidenceHighlight>objeto (carta vermelha)</EvidenceHighlight>, selecione
              o que o objeto significa para o crime.
            </>
          }
          en={
            <>
              Based solely on the <EvidenceHighlight>object (red card)</EvidenceHighlight> you've chosen,
              select the meaning of it to the crime.
            </>
          }
        />
      </RuleInstruction>

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
