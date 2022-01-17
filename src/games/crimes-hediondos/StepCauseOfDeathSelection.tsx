import { Button } from 'antd';
import { useState } from 'react';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { SceneTile } from './SceneTile';
import { SelectedItems } from './SelectedItems';

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

      <SelectedItems
        items={items}
        weaponId={selections.weaponId}
        evidenceId={selections.evidenceId}
        fadeEvidence
      />

      <SceneTile tile={causeOfDeathTile} onSelectValue={onSelectItem} index={causeOfDeathIndex} />

      <ButtonContainer>
        <Button
          type="primary"
          size="large"
          disabled={causeOfDeathIndex === undefined}
          onClick={() => updateSelections({ causeOfDeath: causeOfDeathIndex })}
        >
          »»»
        </Button>
      </ButtonContainer>
    </Step>
  );
}
