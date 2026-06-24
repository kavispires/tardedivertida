import type { ReactNode } from 'react';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useTemporarilyHidePlayersBar } from '@hooks/useTemporarilyHidePlayersBar';
// Icons
import { WaitingRoomIcon } from '@icons/WaitingRoomIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { ReadyPlayersBar } from '@components/players/ReadyPlayersBar';
import { Title } from '@components/text/Title';
// Sass
import styles from './WaitingRoom.module.scss';

type WaitingRoomProps = {
  /**
   * The game players
   */
  players: GamePlayers;
  /**
   * Replacement title of the waiting room
   */
  title?: ReactNode;
  /**
   * Replacement instruction for the waiting room
   */
  instruction?: ReactNode;
  /**
   * Additional content of the waiting room
   */
  children?: ReactNode;
  /**
   * Icon the replaces the default Waiting Room icon
   */
  icon?: ReactNode;
};

/**
 * Component that displays a waiting room screen with player list while waiting for other players
 */
export function WaitingRoom({ players, title, instruction, children, icon }: WaitingRoomProps) {
  useTemporarilyHidePlayersBar();

  return (
    <div className={styles.waitingRoom}>
      <Title colorScheme="light">
        <Translate
          pt="Pronto!"
          en="Done!"
          custom={title}
        />
      </Title>
      {icon ?? <WaitingRoomIcon style={{ width: '6rem' }} />}
      <div className={styles.waitingRoomContent}>
        <Surface>
          {instruction ? (
            instruction
          ) : (
            <Translate
              pt="Vamos aguardar os outros jogadores!"
              en="Please wait for the other players!"
            />
          )}
        </Surface>
        {children}
      </div>
      <ReadyPlayersBar players={players} />
    </div>
  );
}
