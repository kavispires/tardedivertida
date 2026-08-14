// Types
import type { GamePlayers } from 'types/game';
import type { CrimeSceneTileData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { SceneTile } from '@components/game/SceneTile';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { ReadyPlayersBar } from '@components/players/ReadyPlayersBar';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ItemsDict, SubmitCrimePayload } from './utils/types';
import { SelectedItems } from './components/SelectedItems';

type StepReviewCrimeProps = {
  items: ItemsDict;
  selections: SubmitCrimePayload;
  onSubmitCrime: () => void;
  causeOfDeathTile: CrimeSceneTileData;
  reasonForEvidenceTile: CrimeSceneTileData;
  victimTile: CrimeSceneTileData;
  locationTile: CrimeSceneTileData;
  updateSelection: (payload: SubmitCrimePayload) => void;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepReviewCrime({
  announcement,
  items,
  causeOfDeathTile,
  reasonForEvidenceTile,
  victimTile,
  locationTile,
  selections,
  onSubmitCrime,
  updateSelection,
  players,
}: StepReviewCrimeProps) {
  const { translate } = useLanguage();

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <Translate
          pt="Seu crime tá bom?"
          en="Is your crime alright?"
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt="Revise seu crime."
          en="Recap your crime."
        />
      </RuleInstruction>

      <SelectedItems
        items={items}
        weaponId={selections.weaponId ?? ''}
        evidenceId={selections.evidenceId ?? ''}
        locationId={selections.locationId ?? ''}
        victimId={selections.victimId ?? ''}
      />

      <div className="h-scene-tiles-list">
        <SceneTile
          tile={causeOfDeathTile}
          index={selections.causeOfDeathIndex}
          onSelectValue={(payload) => updateSelection({ causeOfDeathIndex: payload.value })}
        />
        <SceneTile
          tile={reasonForEvidenceTile}
          index={selections.reasonForEvidenceIndex}
          onSelectValue={(payload) => updateSelection({ reasonForEvidenceIndex: payload.value })}
        />
        <SceneTile
          tile={victimTile}
          index={selections.victimIndex}
          onSelectValue={(payload) => updateSelection({ victimIndex: payload.value })}
        />
        <SceneTile
          tile={locationTile}
          index={selections.locationIndex}
          onSelectValue={(payload) => updateSelection({ locationIndex: payload.value })}
        />
      </div>

      <SpaceFloat>
        <SendButton
          onClick={onSubmitCrime}
          size="large"
        >
          <Translate
            pt="Enviar"
            en="Submit"
          />
        </SendButton>
      </SpaceFloat>

      <ReadyPlayersBar
        players={players}
        readyText={translate({ pt: 'Já cometi meu crime', en: "I'm done committing my crime" })}
        readyTextPlural={translate({
          pt: 'Já cometemos nossos crimes',
          en: "We're done committing our crimes",
        })}
      />
    </Step>
  );
}
