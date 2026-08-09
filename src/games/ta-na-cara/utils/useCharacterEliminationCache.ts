import { get } from 'lodash';
import { useMemo } from 'react';
// Hooks
import { useCache } from '@hooks/useCache';

type CustomCache = {
  /**
   * Eliminated characters by the player.
   */
  generalEliminations: Dictionary<boolean>;
  /**
   * The active statement to display the perStatement eliminations for.
   */
  activeStatementId: UID | null;
  /**
   * The eliminations for each statement, used to show the inferred eliminations when the player is peeking at a statement.
   */
  perStatement: Dictionary<Dictionary<boolean>>;
  /**
   * Whether to show the inferred eliminations for all statements or not.
   */
  showInferredEliminations: boolean;
  eliminated: Dictionary<boolean>;
};

export function useCharacterEliminationCache() {
  const { cache, setCache, resetCache, updateCache } = useCache<CustomCache>({
    generalEliminations: {},
    activeStatementId: null,
    perStatement: {},
    showInferredEliminations: false,
    eliminated: {},
  });

  const onSelectStatement = (statementId: UID | null) => {
    setCache((prev) => {
      const previousStatementEliminations = statementId ? (prev.perStatement[statementId] ?? {}) : {};

      return {
        ...prev,
        activeStatementId: statementId,
        showInferredEliminations: false, // Reset showInferredEliminations when selecting a statement
        perStatement: {
          ...prev.perStatement,
          ...(statementId ? { [statementId]: previousStatementEliminations } : {}),
        },
      };
    });
  };

  const onToggleInferredEliminations = () => {
    setCache((prev) => ({
      ...prev,
      showInferredEliminations: !prev.showInferredEliminations,
      activeStatementId: null, // Reset active statement when toggling inferred eliminations
    }));
  };

  const onUpdateElimination = (characterId: UID) => {
    // If there's an active statement, only work on that statement's eliminations
    if (cache.activeStatementId) {
      const statementEliminations = get(cache, `perStatement.${cache.activeStatementId}`) ?? {};
      const currentEliminationValue = statementEliminations[characterId] ?? false;
      updateCache(`perStatement.${cache.activeStatementId}.${characterId}`, !currentEliminationValue);
      return;
    }

    const currentEliminationValue = cache.generalEliminations[characterId] ?? false;
    setCache((prev) => ({
      ...prev,
      generalEliminations: {
        ...prev.generalEliminations,
        [characterId]: !currentEliminationValue,
      },
    }));
  };

  const inferredEliminations = useMemo(() => {
    // Gather all eliminations per statement and merge them into a single object, true always overrides false
    const mergedEliminations: Dictionary<boolean> = {};
    Object.values(cache.perStatement).forEach((statementEliminations) => {
      Object.entries(statementEliminations).forEach(([characterId, isEliminated]) => {
        if (isEliminated) {
          mergedEliminations[characterId] = true;
        }
      });
    });
    Object.entries(cache.generalEliminations ?? {}).forEach(([characterId, isEliminated]) => {
      if (isEliminated) {
        mergedEliminations[characterId] = true;
      }
    });
    return mergedEliminations;
  }, [cache.perStatement, cache.generalEliminations]);

  const eliminations = useMemo(() => {
    if (cache.showInferredEliminations) {
      return inferredEliminations;
    }

    if (cache.activeStatementId) {
      return cache.perStatement[cache.activeStatementId] ?? {};
    }

    return cache.generalEliminations;
  }, [
    cache.showInferredEliminations,
    cache.activeStatementId,
    cache.perStatement,
    cache.generalEliminations,
    inferredEliminations,
  ]);

  return {
    showInferredEliminations: cache.showInferredEliminations,
    activeStatementId: cache.activeStatementId,
    eliminations,
    generalEliminations: cache.generalEliminations,
    resetCache,
    onSelectStatement,
    onToggleInferredEliminations,
    onUpdateElimination,
    inferredEliminations,
  };
}
