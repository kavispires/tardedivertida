// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { City, CityLocationsDict } from './utils/types';
import { CityMap } from './components/CityMap';
import { ConeHighlight } from './components/Highlights';

type StepWaitForPlanningProps = {
  players: GamePlayers;
  gameOrder: GameOrder;
  architect: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
} & Pick<StepProps, 'announcement'>;

export function StepWaitForPlanning({
  announcement,
  players,
  gameOrder,
  architect,
  city,
  cityLocationsDict,
  placements,
}: StepWaitForPlanningProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        size="small"
        wait
      >
        <Translate
          pt={
            <>
              <PlayerAvatarName player={architect} /> está planejando a cidade.
            </>
          }
          en={
            <>
              <PlayerAvatarName player={architect} /> is planning the city.
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              No mapa, existem <ConeHighlight>{placements} cones</ConeHighlight> representando onde as
              terrenos onde projetos podem ser construídos.
              <br />
              Aguarde enquanto o engenheiro chefe planeja a cidade.
            </>
          }
          en={
            <>
              On the map, there are <ConeHighlight>{placements} cones</ConeHighlight> representing the land
              where projects can be built.
              <br />
              Wait while the lead engineer plans the city.
            </>
          }
        />
      </RuleInstruction>

      <CityMap
        city={city}
        cityLocationsDict={cityLocationsDict}
      />

      <TurnOrder
        players={players}
        activePlayerId={architect.id}
        order={gameOrder}
      />
    </Step>
  );
}
