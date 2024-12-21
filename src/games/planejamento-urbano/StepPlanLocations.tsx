import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button, Flex, Select } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { LETTERS } from 'utils/constants';
// Icons
import { BrickWallIcon } from 'icons/BrickWallIcon';
import { ConeIcon } from 'icons/ConeIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { FloatingHandDrawer } from 'components/general/FloatingHand';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { City, CityLocationsDict } from './utils/types';
import { getConeColor } from './utils/helpers';
import type { useOnSubmitPlanningAPIRequest } from './utils/api-requests';
import { mockAction } from './utils/mocks';
import { CityMap } from './components/CityMap';
import { ConeHighlight, ConstructionHighlight } from './components/Highlights';
import { LocationCard } from './components/LocationCard';

type StepPlanLocationsProps = {
  players: GamePlayers;
  activePlayerId: PlayerId;
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
  activePlayerId,
  availableProjectsIds,
  city,
  cityLocationsDict,
  placements,
  onSubmitPlanning,
}: StepPlanLocationsProps) {
  const { isLoading } = useLoading();
  const constructionWidth = useCardWidth(placements + 3, { maxWidth: 256 });

  const coneOptions = useMemo(() => {
    return Array.from({ length: placements }, (_, index) => ({
      value: LETTERS[index],
      label: (
        <span>
          <IconAvatar size="small" icon={<ConeIcon color={getConeColor(LETTERS[index])} width={24} />} />
          {LETTERS[index]}
        </span>
      ),
    }));
  }, [placements]);

  const [playerSelections, setPlayerSelections] = useState<Record<string, string>>({});

  const onSelectConstrictionCone = (locationId: string, cone: string) => {
    setPlayerSelections((prev) => ({ ...prev, [locationId]: cone }));
  };

  const isComplete =
    Object.keys(playerSelections).length === placements &&
    new Set(Object.values(playerSelections)).size === placements;

  useMock(() => {
    onSubmitPlanning({ planning: mockAction(placements, availableProjectsIds) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
        <Translate
          pt={<>Decida onde as {placements} novos projetos devem ser construídos</>}
          en={<>Decide where the {placements} new projects should be built</>}
        />
      </Title>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              No mapa, existem <ConeHighlight>{placements} cones</ConeHighlight> representando onde as
              terrenos onde os projetos podem ser feitos.
              <br />
              Na barra no final da tela, você tem os{' '}
              <ConstructionHighlight>{placements} projetos</ConstructionHighlight>, em segredo, decida qual
              projeto vai para qual cone.
            </>
          }
          en={
            <>
              On the map, there are <ConeHighlight>{placements} cones</ConeHighlight> representing the land
              where the projects can be built.
              <br />
              At the bottom of the screen, you have{' '}
              <ConstructionHighlight>{placements} projects</ConstructionHighlight>, in secret, decide which
              project goes to which cone.
            </>
          }
        />
      </RuleInstruction>

      <CityMap city={city} cityLocationsDict={cityLocationsDict} />

      <TurnOrder players={players} activePlayerId={activePlayerId} order={gameOrder} />

      <FloatingHandDrawer
        icon={<BrickWallIcon />}
        title={<Translate pt="Novos Projetos" en="New Projects" />}
      >
        <Flex justify="center">
          <Button
            type="primary"
            size="large"
            disabled={isLoading || !isComplete}
            onClick={() => onSubmitPlanning({ planning: playerSelections })}
          >
            <Translate pt="Confirmar" en="Confirm" />
          </Button>
        </Flex>
        <Flex justify="center" className="mt-2" gap={6}>
          {availableProjectsIds.map((locationId) => (
            <Flex key={locationId} vertical align="center">
              <Select
                options={coneOptions}
                className="full-width"
                placeholder={<Translate pt="Selecione um cone" en="Select a cone" />}
                value={playerSelections[locationId]}
                onChange={(value) => onSelectConstrictionCone(locationId, value)}
              />
              <LocationCard
                locationId={locationId}
                cityLocationsDict={cityLocationsDict}
                width={constructionWidth}
              />
            </Flex>
          ))}
        </Flex>
      </FloatingHandDrawer>
    </Step>
  );
}
