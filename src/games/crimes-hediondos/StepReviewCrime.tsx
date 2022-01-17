import { CloudUploadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components';
import { SceneTile } from './SceneTile';
import { SelectedItems } from './SelectedItems';

type StepReviewCrimeProps = {
  items: ItemsDict;
  selections: PlainObject;
  onSubmitCrime: GenericFunction;
  locationTiles: SceneTile[];
  causeOfDeathTile: SceneTile;
  reasonForEvidenceTile: SceneTile;
  updateSelection: GenericFunction;
};

export function StepReviewCrime({
  items,
  causeOfDeathTile,
  reasonForEvidenceTile,
  locationTiles,
  selections,
  onSubmitCrime,
  updateSelection,
}: StepReviewCrimeProps) {
  const locationTile = locationTiles.find((location) => location.id === selections.locationTile);

  return (
    <Step>
      <Title>
        <Translate pt="Seu crime tá bom?" en="Is your crime alright?" />
      </Title>
      <Instruction contained>
        <Translate pt={<>Revise seu crime.</>} en={<>Recap your crime.</>} />
      </Instruction>

      <SelectedItems items={items} weaponId={selections.weaponId} evidenceId={selections.evidenceId} />

      <div className="h-scene-tiles-list">
        <SceneTile
          tile={causeOfDeathTile}
          index={selections.causeOfDeath}
          onSelectValue={(payload) => updateSelection({ causeOfDeath: payload.value })}
        />
        <SceneTile
          tile={reasonForEvidenceTile}
          index={selections.reasonForEvidence}
          onSelectValue={(payload) => updateSelection({ reasonForEvidence: payload.value })}
        />
        <SceneTile
          tile={locationTile!}
          index={selections.locationIndex}
          onSelectValue={(payload) =>
            updateSelection({ locationTile: payload.tileId, locationIndex: payload.value })
          }
        />
      </div>

      <ButtonContainer>
        <Button type="primary" size="large" onClick={onSubmitCrime} icon={<CloudUploadOutlined />}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
