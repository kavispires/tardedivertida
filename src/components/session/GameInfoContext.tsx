import { createContext, type ReactNode, useContext } from 'react';
import { useTitle } from 'react-use';
// Types
import type { GameInfo } from 'types/game-info';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAME_LIST from 'utils/info';

const PLACEHOLDER_GAME_INFO: GameInfo = {
  gameCode: ' ',
  gameName: '',
  version: '',
  release: '',
  available: false,
  title: { en: '', pt: '' },
  popularName: { en: '', pt: '' },
  inspiredBy: '',
  summary: { en: '', pt: '' },
  appearance: {
    clouds: 'cloud',
    cloudsAnimationType: 'flow',
    primaryColor: '',
    colorScheme: 'light',
    videoBackground: false,
  },
  rules: {
    pt: [''],
    en: [''],
  },
  playerCount: {
    recommended: [0],
    min: 0,
    max: 0,
  },
  tags: [''],
};

export const GameInfoContext = createContext<GameInfo>(PLACEHOLDER_GAME_INFO);

type GameInfoContextType = {
  gameCollection: GameName;
  children: ReactNode;
};

/**
 * Provides game information context to its children components.
 * @param props.gameCollection - The key for the game collection to be used.
 * @param props.children - The child components that will consume the context.
 * @returns The provider component that wraps its children with game information context.
 */
export const GameInfoProvider = ({ gameCollection, children }: GameInfoContextType) => {
  const { dualTranslate } = useLanguage();
  const info =
    gameCollection && GAME_LIST[gameCollection] ? GAME_LIST[gameCollection] : PLACEHOLDER_GAME_INFO;
  const gameName = dualTranslate(info?.title ?? PLACEHOLDER_GAME_INFO.title);

  useTitle(`${gameName ? `${gameName} | ` : ''}Tarde Divertida`);

  return <GameInfoContext.Provider value={info}>{children}</GameInfoContext.Provider>;
};

/**
 * Custom hook to access the GameInfoContext.
 *
 * This hook provides the current context value of GameInfoContext.
 * If the hook is used outside of a GameInfoProvider, a warning is logged
 * and the context defaults to a placeholder.
 *
 * @returns The current context value of GameInfoContext.
 *
 * @example
 * const gameInfo = useGameInfoContext();
 *
 * @throws If the hook is used outside of a GameInfoProvider.
 */
export const useGameInfoContext = () => {
  const context = useContext(GameInfoContext);

  if (!context) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.warn('useGameInfoContext should be used within a GameInfoProvider, defaulting to placeholder');
  }

  return context;
};

export const useGameAppearance = () => {
  const info = useGameInfoContext();

  return info.appearance;
};
