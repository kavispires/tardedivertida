import type { ReactNode } from 'react';
// Types
import type { GamePlayer } from 'types/player';

type ContainerProps = {
  user: GamePlayer;
  children: ReactNode;
};

/**
 * Conditionally render content if user is an alien
 * @param param0
 */
export function AlienContent({ user, children }: ContainerProps) {
  const isAlien = user.role === 'alien';

  if (isAlien) {
    return <>{children}</>;
  }

  return null;
}

/**
 * Conditionally render content if user is a human
 * @param param0
 */
export function HumanContent({ user, children }: ContainerProps) {
  const isHuman = user.role === 'human';

  if (isHuman) {
    return <>{children}</>;
  }

  return null;
}
