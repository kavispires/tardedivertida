import { useEffect } from "react";
// Ant Design Resources
import { App } from "antd";
// Types
import type { GameState } from "types/game";
// Utils
import { print } from "utils/helpers";
// Internal
import { useFirestoreDocument } from "./useFirestoreDocument";

export function useGameState(gameId: GameId, gameName: GameName): GameState {
  const { notification } = App.useApp();
  const docPath = `games/${gameName}/${gameId}/state`;

  const { isLoading, isRefetching, isError, error, data } =
    useFirestoreDocument(docPath, true);

  if (isError) {
    notification.error({
      message:
        "The application found an error while trying to update the game state",
      description: JSON.stringify(error),
      placement: "bottomLeft",
    });
    console.error(error);
  }

  const state = data ?? {};

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isLoading || isRefetching) {
      console.count("Refreshing state...");
    } else {
      print({ state });
    }
  }, [isLoading, isRefetching]);

  return state as GameState;
}
