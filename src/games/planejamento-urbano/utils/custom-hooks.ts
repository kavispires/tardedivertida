import { useState } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';

export const useLocationWidth = (cityWidth: number) => {
  return useCardWidth(cityWidth + 2, {
    maxWidth: 300,
    gap: 16,
  });
};

export const useAssignLocationsToCones = (availableProjectsIds: string[]) => {
  const [playerSelections, setPlayerSelections] = useState<Record<string, string>>({});

  const updatePlayerSelections = (selections: Record<string, string>) => {
    setPlayerSelections((prev) => {
      const copy = { ...prev };
      // The locationId is the key, and the coneId is the value
      // If a coneId is already assigned to another locationId, remove that assignment
      const assignedConeIds = new Set(Object.values(copy));
      for (const [_locationId, coneId] of Object.entries(selections)) {
        if (assignedConeIds.has(coneId)) {
          const locationToRemove = Object.keys(copy).find((key) => copy[key] === coneId);
          if (locationToRemove) {
            delete copy[locationToRemove];
          }
        }
      }

      // Return the updated selections
      return { ...copy, ...selections };
    });
  };

  const isComplete =
    Object.keys(playerSelections).length === availableProjectsIds.length &&
    new Set(Object.values(playerSelections)).size === availableProjectsIds.length;

  return {
    playerSelections,
    updatePlayerSelections,
    setPlayerSelections,
    isComplete,
  };
};
