// Ant Design Resources
import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { ItemsDict } from './utils/types';
import { SelectedItems } from './components/SelectedItems';

type StepReviewCrimeProps = {
  items: ItemsDict;
  selections: PlainObject;
  onSubmitCrime: GenericFunction;
  locationTiles: CrimeSceneTile[];
  causeOfDeathTile: CrimeSceneTile;
  reasonForEvidenceTile: CrimeSceneTile;
  updateSelection: GenericFunction;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepReviewCrime({
  announcement,
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
    <Step announcement={announcement}>
      <StepTitle>
        <Translate pt="Seu crime tá bom?" en="Is your crime alright?" />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate pt={<>Revise seu crime.</>} en={<>Recap your crime.</>} />
      </RuleInstruction>

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
        {!!locationTile && (
          <SceneTile
            tile={locationTile}
            index={selections.locationIndex}
            onSelectValue={(payload) =>
              updateSelection({ locationTile: payload.tileId, locationIndex: payload.value })
            }
          />
        )}
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
