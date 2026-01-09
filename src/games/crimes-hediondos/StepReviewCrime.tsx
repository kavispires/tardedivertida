// Types
import type { GamePlayers } from 'types/player';
import type { CrimeSceneTile } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SendButton } from 'components/buttons';
import { SceneTile } from 'components/game/SceneTile';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { ReadyPlayersBar } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { ItemsDict, SubmitCrimePayload } from './utils/types';
import { SelectedItems } from './components/SelectedItems';

type StepReviewCrimeProps = {
  items: ItemsDict;
  selections: SubmitCrimePayload;
  onSubmitCrime: () => void;
  causeOfDeathTile: CrimeSceneTile;
  reasonForEvidenceTile: CrimeSceneTile;
  victimTile: CrimeSceneTile;
  locationTile: CrimeSceneTile;
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
          pt={<>Revise seu crime.</>}
          en={<>Recap your crime.</>}
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

      <SpaceContainer align="center">
        <SendButton
          onClick={onSubmitCrime}
          size="large"
        >
          <Translate
            pt="Enviar"
            en="Submit"
          />
        </SendButton>
      </SpaceContainer>

      <ReadyPlayersBar
        players={players}
        readyText={translate('Já cometi meu crime', "I'm done committing my crime")}
        readyTextPlural={translate('Já cometemos nossos crimes', "We're done committing our crimes")}
      />
    </Step>
  );
}
