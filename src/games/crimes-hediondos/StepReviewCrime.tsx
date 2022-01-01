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
};

export function StepReviewCrime({
  items,
  causeOfDeathTile,
  reasonForEvidenceTile,
  locationTiles,
  selections,
  onSubmitCrime,
}: StepReviewCrimeProps) {
  const locationTile = locationTiles.find((location) => location.id === selections.locationTile);

  return (
    <Step>
      <Title>
        <Translate pt="Onde foi o crime?" en="Where was the crime?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>Revise seu crime. Não dá pra mudar nada mais, o crime foi cometido. É só pra revisar mesmo.</>
          }
          en={
            <>
              Recap your crime. You can't change anything, the crime has been already committed, so you can
              only recap anyway.
            </>
          }
        />
      </Instruction>

      <SelectedItems items={items} weaponId={selections.weaponId} evidenceId={selections.evidenceId} />

      <div className="h-scene-tiles-list">
        <SceneTile tile={causeOfDeathTile} index={selections.causeOfDeath} />
        <SceneTile tile={reasonForEvidenceTile} index={selections.reasonForEvidence} />
        <SceneTile tile={locationTile!} index={selections.locationIndex} />
      </div>

      <ButtonContainer>
        <Button type="primary" size="large" onClick={onSubmitCrime} icon={<CloudUploadOutlined />}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}
