import { invert } from "lodash";
import { useMemo, useState } from "react";
// Ant Design Resources
import { Button, Flex, Select, Space } from "antd";
// Types
import type { GamePlayer, GamePlayers } from "types/player";
// Hooks
import { useCardWidth } from "hooks/useCardWidth";
import { useLoading } from "hooks/useLoading";
import { useMock } from "hooks/useMock";
// Utils
import { LETTERS } from "utils/constants";
// Icons
import { AnimatedClockIcon } from "icons/AnimatedClockIcon";
import { BrickWallIcon } from "icons/BrickWallIcon";
import { ConeIcon } from "icons/ConeIcon";
// Components
import { AvatarName, IconAvatar } from "components/avatars";
import { FloatingHandDrawer } from "components/general/FloatingHand";
import { Translate } from "components/language";
import { TurnOrder } from "components/players";
import { Step, type StepProps } from "components/steps";
import { RuleInstruction, Title } from "components/text";
// Internal
import { City, CityLocationsDict } from "./utils/types";
import { getConeColor } from "./utils/helpers";
import {
  useOnSubmitPlacingAPIRequest,
  useOnUpdatePlacementAPIRequest,
} from "./utils/api-requests";
import { mockAction } from "./utils/mocks";
import { CityMap } from "./components/CityMap";
import { ConeHighlight } from "./components/Highlights";
import { LocationCard } from "./components/LocationCard";

type StepPlaceLocationsProps = {
  players: GamePlayers;
  gameOrder: GameOrder;
  controller: GamePlayer;
  isTheController: boolean;
  isTheActivePlayer: boolean;
  activePlayer: GamePlayer;
  city: City;
  cityLocationsDict: CityLocationsDict;
  placements: number;
  availableProjectsIds: string[];
  evaluations: Record<string, string>;
  planning: Record<string, string>;
  onSubmitConstruction: ReturnType<typeof useOnSubmitPlacingAPIRequest>;
  onUpdateConstruction: ReturnType<typeof useOnUpdatePlacementAPIRequest>;
} & Pick<StepProps, "announcement">;

export function StepPlaceLocations({
  players,
  announcement,
  gameOrder,
  availableProjectsIds,
  controller,
  isTheController,
  isTheActivePlayer,
  activePlayer,
  city,
  cityLocationsDict,
  placements,
  evaluations,
  planning,
  onSubmitConstruction,
  onUpdateConstruction,
}: StepPlaceLocationsProps) {
  const { isLoading } = useLoading();
  const constructionWidth = useCardWidth(placements + 3, { maxWidth: 256 });

  const coneOptions = useMemo(() => {
    return Array.from({ length: placements }, (_, index) => ({
      value: LETTERS[index],
      label: (
        <Flex justify="center" align="center">
          <IconAvatar
            size="small"
            icon={<ConeIcon color={getConeColor(LETTERS[index])} width={24} />}
          />
          {LETTERS[index]}
        </Flex>
      ),
    }));
  }, [placements]);

  const [playerSelections, setPlayerSelections] =
    useState<Record<string, string>>(evaluations);

  const mapEvaluations = useMemo(() => {
    return invert(evaluations);
  }, [evaluations]);

  const onSelectConstrictionCone = (locationId: string, cone: string) => {
    const newEvaluation = { ...playerSelections };
    const existingCone = Object.values(newEvaluation).find(
      (selectedCone) => selectedCone === cone,
    );
    if (existingCone) {
      const locationToRemove = Object.keys(newEvaluation).find(
        (key) => newEvaluation[key] === existingCone,
      );
      if (locationToRemove) {
        delete newEvaluation[locationToRemove];
      }
    }
    newEvaluation[locationId] = cone;

    onUpdateConstruction({ evaluations: newEvaluation });
    setPlayerSelections(newEvaluation);
  };

  const isComplete =
    Object.keys(playerSelections).length === placements &&
    new Set(Object.values(playerSelections)).size === placements;

  useMock(() => {
    if (isTheController) {
      onSubmitConstruction({
        evaluations: mockAction(placements, availableProjectsIds),
      });
    }
  });

  return (
    <Step fullWidth announcement={announcement}>
      {isTheActivePlayer ? (
        <Title size="small">
          <IconAvatar icon={<AnimatedClockIcon />} size="large" />{" "}
          <Translate
            pt={
              <>
                Aguarde enquanto os jogadores discutem e decidem onde cada
                projeto deve ir
              </>
            }
            en={
              <>
                Wait while the players discuss and decide where each project
                should go
              </>
            }
          />
        </Title>
      ) : (
        <Title size="small">
          <Translate
            pt={<>Discutam e decidam onde cada projeto deve ir</>}
            en={<>Discuss and decide where each project should go</>}
          />
        </Title>
      )}

      <RuleInstruction type={isTheActivePlayer ? "wait" : "action"}>
        <Translate
          pt={
            <>
              No mapa, existem <ConeHighlight>{placements} cones</ConeHighlight>{" "}
              representando onde as terrenos onde os projetos podem ser feitos.{" "}
              <br />O objetivo é fazer as construções de acordo com o que
              <AvatarName player={activePlayer} /> planejou.
              <br />
              <AvatarName player={controller} addressUser /> é o pedreiro e
              controlará as decisões do grupo.
            </>
          }
          en={
            <>
              On the map, there are{" "}
              <ConeHighlight>{placements} cones</ConeHighlight> representing the
              land where the projects can be built. <br />
              <br />
              <AvatarName player={controller} addressUser />{" "}
              {isTheController ? "are" : "is"} the bricklayer and will control
              the group's decisions.
            </>
          }
        />
      </RuleInstruction>

      {isTheController && (
        <Space className="space-container">
          <Button
            type="primary"
            size="large"
            disabled={isLoading || !isComplete}
            onClick={() =>
              onSubmitConstruction({ evaluations: playerSelections })
            }
          >
            <Translate pt="Confirmar Seleções" en="Confirm Selections" />
          </Button>
        </Space>
      )}

      {!isTheController && (
        <Flex justify="center" className="mt-2" gap={6}>
          {availableProjectsIds.map((locationId) => (
            <Flex key={locationId} vertical align="center">
              <Select
                options={coneOptions}
                className="full-width"
                value={evaluations[locationId]}
                disabled
                variant="borderless"
              />
              <LocationCard
                locationId={locationId}
                cityLocationsDict={cityLocationsDict}
                width={constructionWidth / 1.75}
                fontSize="small"
              />
              {isTheActivePlayer && (
                <Select
                  options={coneOptions}
                  className="full-width"
                  value={planning[locationId]}
                  variant="filled"
                  disabled
                />
              )}
            </Flex>
          ))}
        </Flex>
      )}

      <CityMap
        city={city}
        cityLocationsDict={cityLocationsDict}
        mapEvaluations={mapEvaluations}
      />

      <TurnOrder
        players={players}
        activePlayerId={activePlayer.id}
        order={gameOrder}
      />

      {isTheController && (
        <FloatingHandDrawer
          icon={<BrickWallIcon />}
          title={<Translate pt="Construções" en="Constructions" />}
        >
          <Flex justify="center">
            {availableProjectsIds.map((locationId) => (
              <Flex key={locationId} vertical align="center">
                <Select
                  options={coneOptions}
                  className="full-width"
                  placeholder={
                    <Translate pt="Selecione um cone" en="Select a cone" />
                  }
                  value={playerSelections[locationId]}
                  onChange={(value) =>
                    onSelectConstrictionCone(locationId, value)
                  }
                  disabled={isLoading}
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
      )}
    </Step>
  );
}
