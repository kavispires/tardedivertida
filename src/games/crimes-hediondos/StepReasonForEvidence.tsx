import { useState } from 'react';
// Types
import type { CrimeSceneTile } from 'types/tdr';
// Components
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { ItemsDict, SceneTilePayload, SubmitCrimePayload } from './utils/types';
import { SelectedItems } from './components/SelectedItems';
import { ContinueButton } from './components/ContinueButton';
import { ResetButton } from './components/ResetButton';
import { EvidenceHighlight } from './components/Highlights';

type StepReasonForEvidenceProps = {
  items: ItemsDict;
  selections: SubmitCrimePayload;
  updateSelections: (payload: SubmitCrimePayload) => void;
  reasonForEvidenceTile: CrimeSceneTile;
  goToStep: (step: number) => void;
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
      <StepTitle>
        <Translate pt="O que tinha no seu último crime?" en="What was in your last crime?" />
      </StepTitle>
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

      <SpaceContainer>
        <SelectedItems
          items={items}
          weaponId={selections.weaponId ?? ''}
          evidenceId={selections.evidenceId ?? ''}
          fadeWeapon
        />

        <SceneTile tile={reasonForEvidenceTile} onSelectValue={onSelectItem} index={reasonForEvidenceIndex} />
      </SpaceContainer>

      <SpaceContainer>
        <ResetButton goToStep={goToStep} />

        <ContinueButton
          disabled={reasonForEvidenceIndex === undefined}
          onClick={() => updateSelections({ reasonForEvidenceIndex })}
        />
      </SpaceContainer>
    </Step>
  );
}
