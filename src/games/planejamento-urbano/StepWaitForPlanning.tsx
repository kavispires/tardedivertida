// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
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
          pt="{architect} está planejando a cidade."
          en="{architect} is planning the city."
          values={{
            architect: <PlayerAvatarName player={architect} />,
          }}
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt="No mapa, existem {placements} cones representando onde os terrenos onde projetos podem ser construídos.
          <br/>
          Aguarde enquanto o engenheiro chefe planeja a cidade."
          en="On the map, there are {placements} cones representing the land where projects can be built.
          <br/>
          Wait while the lead engineer plans the city."
          values={{
            placements: <ConeHighlight>{placements}</ConeHighlight>,
          }}
        />
      </RuleInstruction>

      <CityMap
        city={city}
        cityLocationsDict={cityLocationsDict}
      />

      <PlayersTurnOrder
        players={players}
        activePlayerId={architect.id}
        order={gameOrder}
      />
    </Step>
  );
}
