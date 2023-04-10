import { useEffect, useState } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useGameState } from 'hooks/useGameState';
import { useGlobalState } from 'hooks/useGlobalState';
import { useGamePlayers } from 'hooks/useGamePlayers';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAME_LIST from 'utils/info';
// Components
import { PhaseLobby } from 'components/phases';
import { GameInfoDrawer } from 'components/drawers';
import { AdminMenuDrawer } from 'components/admin';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useGameMeta } from 'hooks/useGameMeta';

type SessionProps = {
  /**
   * The id of the game
   */
  gameId: GameId;
  /**
   * The game collection name
   */
  gameCollection: GameName;
  /**
   * The active component to be rendered, usually a Phase... component
   */
  getActiveComponent: (args: any) => any;
  /**
   * The class to replace the background gradient
   */
  backgroundClassName?: string;
};

export function Session({ gameId, gameCollection, getActiveComponent, backgroundClassName }: SessionProps) {
  const gameMeta = useGameMeta();
  const { language } = useLanguage();
  const players = useGamePlayers(gameId, gameCollection);
  const state = useGameState(gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [info, setInfo] = useState<any>({});
  const gameName = info?.title ?? '';

  useIdleRedirect();

  useTitle(`${gameName ? `${gameName[language]} | ` : ''}Tarde Divertida`);

  // Update game description as the gameId comes in
  useEffect(() => {
    setInfo(gameCollection ? GAME_LIST[gameCollection] : {});
  }, [gameCollection]);

  // Colorize background
  useEffect(() => {
    if (backgroundClassName) {
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.classList.add(backgroundClassName);
      }
    }
    return () => {
      const appElement = document.getElementById('app');
      appElement?.classList.remove(backgroundClassName ?? '');
    };
  }, [backgroundClassName]);

  if (!userId) {
    return <PhaseLobby players={players} info={info} meta={gameMeta} />;
  }

  const ActiveComponent: any = getActiveComponent(state.phase);

  return (
    <>
      <GameInfoDrawer players={players} state={state} info={info} userId={userId} />
      <ActiveComponent players={players} state={state} info={info} meta={gameMeta} />
      <AdminMenuDrawer state={state} players={players} />
    </>
  );
}
