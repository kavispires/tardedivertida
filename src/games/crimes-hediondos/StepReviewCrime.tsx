// Ant Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { SceneTile } from './components/SceneTile';
import { SelectedItems } from './components/SelectedItems';

type StepReviewCrimeProps = {
  items: ItemsDict;
  selections: PlainObject;
  onSubmitCrime: GenericFunction;
  locationTiles: SceneTile[];
  causeOfDeathTile: SceneTile;
  reasonForEvidenceTile: SceneTile;
  updateSelection: GenericFunction;
  players: GamePlayers;
};

export function StepReviewCrime({
  items,
  causeOfDeathTile,
  reasonForEvidenceTile,
  locationTiles,
  selections,
  onSubmitCrime,
  updateSelection,
  players,
}: StepReviewCrimeProps) {
  const { translate } = useLanguage();

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

      <Space className="space-container" align="center">
        <Button type="primary" size="large" onClick={onSubmitCrime} icon={<CloudUploadOutlined />}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Space>

      <ReadyPlayersBar
        players={players}
        readyText={translate('Já cometi meu crime', "I'm done committing my crime")}
        readyTextPlural={translate('Já cometemos nossos crimes', "We're done committing our crimes")}
      />
    </Step>
  );
}
