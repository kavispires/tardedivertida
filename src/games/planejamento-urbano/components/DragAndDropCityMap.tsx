import { DndContext, useSensors, useSensor, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { type ReactNode, useCallback } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Icons
import { BrickWallIcon } from 'icons/BrickWallIcon';
import { ConeIcon } from 'icons/ConeIcon';
// Components
import { DraggableItem } from 'components/drag-and-drop/DragAndDrop';
import { Title } from 'components/text';
// Internal
import type { City, CityLocationsDict } from '../utils/types';
import { getConeColor } from '../utils/helpers';
import { CityMap } from './CityMap';
import { LocationCard } from './LocationCard';

type DragAndDropCityMapProps = {
  city: City;
  cityLocationsDict: CityLocationsDict;
  availableProjectsIds: string[];
  constructionWidth: number;
  playerSelections: Record<string, string>;
  updatePlayerSelections: (selections: Record<string, string>) => void;
  title: ReactNode;
  children?: ReactNode;
};

export function DragAndDropCityMap({
  city,
  cityLocationsDict,
  availableProjectsIds,
  constructionWidth,
  playerSelections,
  updatePlayerSelections,
  title,
  children,
}: DragAndDropCityMapProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag distance before activation
      },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const selectedLocationId = String(active.id);
        const targetConeId = String(over.id);
        updatePlayerSelections({ [selectedLocationId]: targetConeId });
      }
    },
    [updatePlayerSelections],
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="city-map-actions-container">
        <CityMap
          city={city}
          cityLocationsDict={cityLocationsDict}
          mapEvaluations={playerSelections}
          dragAndDropEnabled
        />
        <Flex className="contained" vertical>
          <Title level={5} size="xx-small" icon={<BrickWallIcon />}>
            {title}
          </Title>
          <Flex justify="center" vertical className="my-2" gap={6}>
            {children}
          </Flex>
          <Flex justify="center" className="mt-2" gap={6} vertical>
            {availableProjectsIds.map((locationId) => {
              const coneId = playerSelections[locationId];

              const color = getConeColor(coneId);

              return (
                <Flex
                  key={locationId}
                  vertical
                  align="center"
                  className="u-location-card-draggable-container"
                >
                  {!!coneId && (
                    <span className="u-location-card-selected-cone">
                      <ConeIcon color={color} width={32} />
                    </span>
                  )}
                  <DraggableItem
                    id={locationId}
                    className="u-location-card-draggable"
                    options={{
                      dragOpacity: 0.8,
                      dragScale: 0.85,
                      dragRotate: -6,
                      withTransition: true,
                    }}
                  >
                    <LocationCard
                      locationId={locationId}
                      cityLocationsDict={cityLocationsDict}
                      width={constructionWidth}
                    />
                  </DraggableItem>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </div>
    </DndContext>
  );
}
