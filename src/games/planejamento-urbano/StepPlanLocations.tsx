// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { SendButton } from 'components/buttons';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { City, CityLocationsDict } from './utils/types';
import type { useOnSubmitPlanningAPIRequest } from './utils/api-requests';
import { mockAction } from './utils/mocks';
import { useAssignLocationsToCones } from './utils/custom-hooks';
import { ConeHighlight, ConstructionHighlight } from './components/Highlights';
import { DragAndDropCityMap } from './components/DragAndDropCityMap';

type StepPlanLocationsProps = {
  players: GamePlayers;
  architectId: PlayerId;
  gameOrder: GameOrder;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
  availableProjectsIds: string[];
  onSubmitPlanning: ReturnType<typeof useOnSubmitPlanningAPIRequest>;
} & Pick<StepProps, 'announcement'>;

export function StepPlanLocations({
  players,
  announcement,
  gameOrder,
  architectId,
  availableProjectsIds,
  city,
  cityLocationsDict,
  placements,
  onSubmitPlanning,
}: StepPlanLocationsProps) {
  const constructionWidth = useCardWidth(placements + 5, { maxWidth: 128 });

  const { playerSelections, setPlayerSelections, updatePlayerSelections, isComplete } =
    useAssignLocationsToCones(availableProjectsIds);

  // useMock(() => {
  //   onSubmitPlanning({ planning: mockAction(placements, availableProjectsIds) });
  // });

  const onMock = () => {
    setPlayerSelections(mockAction(placements, availableProjectsIds));
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small">
        <Translate
          pt={<>Decida onde as {availableProjectsIds.length} novos projetos devem ser construídos</>}
          en={<>Decide where the {availableProjectsIds.length} new projects should be built</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              No mapa, existem <ConeHighlight>{placements} cones</ConeHighlight> representando onde as
              terrenos onde os projetos podem ser feitos.
              <br />À direita, você tem os{' '}
              <ConstructionHighlight>{availableProjectsIds.length} projetos</ConstructionHighlight>, em
              segredo, decida qual projeto vai para qual cone.
              <br />
              Arraste o projeto para o cone desejado. Para remove um projeto de um cone, baste clicar nele.
            </>
          }
          en={
            <>
              On the map, there are <ConeHighlight>{placements} cones</ConeHighlight> representing the land
              where the projects can be built.
              <br />
              On the right of the screen, you have{' '}
              <ConstructionHighlight>{availableProjectsIds.length} projects</ConstructionHighlight>, in
              secret, decide which project goes to which cone.
              <br /> Drag the project to the desired cone. To remove a project from a cone, just click on it.
            </>
          }
        />
      </RuleInstruction>

      <DragAndDropCityMap
        city={city}
        cityLocationsDict={cityLocationsDict}
        availableProjectsIds={availableProjectsIds}
        constructionWidth={constructionWidth}
        playerSelections={playerSelections}
        updatePlayerSelections={updatePlayerSelections}
        title={<Translate pt="Novos Projetos" en="New Projects" />}
      >
        <SendButton
          type="primary"
          size="large"
          disabled={!isComplete}
          onClick={() => onSubmitPlanning({ planning: playerSelections })}
        >
          <Translate pt="Confirmar" en="Confirm" />
        </SendButton>
        <DevButton size="small" onClick={onMock}>
          Mock
        </DevButton>
      </DragAndDropCityMap>

      <TurnOrder players={players} activePlayerId={architectId} order={gameOrder} />
    </Step>
  );
}
