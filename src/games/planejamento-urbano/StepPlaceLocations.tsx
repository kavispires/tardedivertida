// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useMock } from 'hooks/useMock';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { DevButton } from 'components/debug/DevButton';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { City, CityLocationsDict } from './utils/types';
import type { useOnSubmitPlacingAPIRequest } from './utils/api-requests';
import { mockAction } from './utils/mocks';
import { useAssignLocationsToCones } from './utils/custom-hooks';
import { CityMap } from './components/CityMap';
import { ConeHighlight } from './components/Highlights';
import { DragAndDropCityMap } from './components/DragAndDropCityMap';

type StepPlaceLocationsProps = {
  players: GamePlayers;
  gameOrder: GameOrder;
  isTheArchitect: boolean;
  architect: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
  availableProjectsIds: string[];
  planning: Record<string, string>;
  onSubmitConstruction: ReturnType<typeof useOnSubmitPlacingAPIRequest>;
} & Pick<StepProps, 'announcement'>;

export function StepPlaceLocations({
  players,
  announcement,
  gameOrder,
  availableProjectsIds,
  isTheArchitect,
  architect,
  city,
  cityLocationsDict,
  placements,
  planning,
  onSubmitConstruction,
}: StepPlaceLocationsProps) {
  const constructionWidth = useCardWidth(placements + 5, { maxWidth: 128 });

  const { playerSelections, setPlayerSelections, updatePlayerSelections, isComplete } =
    useAssignLocationsToCones(availableProjectsIds);

  const onMock = () => {
    setPlayerSelections(mockAction(placements, availableProjectsIds));
  };

  useMock(() => {
    if (!isTheArchitect) {
      onSubmitConstruction({ evaluations: mockAction(placements, availableProjectsIds) });
    }
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle
        size="small"
        wait={isTheArchitect}
      >
        {isTheArchitect ? (
          <Translate
            en={<>Wait while the players try to match where each project should go with your planning.</>}
            pt={
              <>
                Aguarde enquanto os jogadores tentam fazer cada projeto deve ir de acordo com seu
                planejamento.
              </>
            }
          />
        ) : (
          <Translate
            pt={<>Decida onde cada projeto deve ir</>}
            en={<>Decide where each project should go</>}
          />
        )}
      </StepTitle>

      <RuleInstruction type={isTheArchitect ? 'wait' : 'action'}>
        <Translate
          pt={
            <>
              No mapa, existem <ConeHighlight>{placements} cones</ConeHighlight> representando onde as
              terrenos onde os projetos podem ser feitos. <br />O objetivo é fazer as construções de acordo
              com o que
              <PlayerAvatarName player={architect} /> planejou.
            </>
          }
          en={
            <>
              On the map, there are <ConeHighlight>{placements} cones</ConeHighlight> representing the land
              where the projects can be built. <br />
              The goal is to make the constructions according to what
              <PlayerAvatarName player={architect} /> planned.
            </>
          }
        />
      </RuleInstruction>

      <ViewIf condition={isTheArchitect}>
        <CityMap
          city={city}
          cityLocationsDict={cityLocationsDict}
          mapEvaluations={planning}
        />
      </ViewIf>

      <ViewIf condition={!isTheArchitect}>
        <DragAndDropCityMap
          city={city}
          cityLocationsDict={cityLocationsDict}
          availableProjectsIds={availableProjectsIds}
          constructionWidth={constructionWidth}
          playerSelections={playerSelections}
          updatePlayerSelections={updatePlayerSelections}
          title={
            <Translate
              pt="Projetos"
              en="Projects"
            />
          }
        >
          <SendButton
            type="primary"
            size="large"
            disabled={!isComplete}
            onClick={() => onSubmitConstruction({ evaluations: playerSelections })}
          >
            <Translate
              pt="Confirmar"
              en="Confirm"
            />
          </SendButton>
          <DevButton
            size="small"
            onClick={onMock}
          >
            Mock
          </DevButton>
        </DragAndDropCityMap>
      </ViewIf>

      <TurnOrder
        players={players}
        activePlayerId={architect.id}
        order={gameOrder}
      />
    </Step>
  );
}
