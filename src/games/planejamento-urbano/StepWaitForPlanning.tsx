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
// Icons
// Hooks

type StepWaitForPlanningProps = {
  players: GamePlayers;
  gameOrder: GameOrder;
  activePlayer: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
} & Pick<StepProps, 'announcement'>;

export function StepWaitForPlanning({
  announcement,
  players,
  gameOrder,
  activePlayer,
  city,
  cityLocationsDict,
}: StepWaitForPlanningProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small" wait>
        <Translate
          pt={
            <>
              <PlayerAvatarName player={activePlayer} /> está planejando a cidade.
            </>
          }
          en={
            <>
              <PlayerAvatarName player={activePlayer} /> is planning the city.
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt="Aguarde enquanto o engenheiro chefe planeja a cidade. Você pode observar o mapa e os cones representando as possíveis localizações para a construção"
          en="Wait while the chief engineer plans the city. You can observe the map and the cones representing the possible locations for construction"
        />
      </RuleInstruction>

      <CityMap city={city} cityLocationsDict={cityLocationsDict} />

      <TurnOrder players={players} activePlayerId={activePlayer.id} order={gameOrder} />
    </Step>
  );
}
