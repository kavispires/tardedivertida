import { ReactNode } from 'react';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Instruction, Title } from 'components/text';
import { WaitingRoomIcon } from 'components/icons/WaitingRoomIcon';

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

export function WaitingRoom({ players, title, instruction, children, icon }: WaitingRoomProps) {
  useTemporarilyHidePlayersBar();

  return (
    <div className="waiting-room">
      <Title>
        <Translate pt="Pronto!" en="Done!" custom={title} />
      </Title>
      {icon ?? <WaitingRoomIcon style={{ width: '6rem' }} />}
      <Instruction>
        {Boolean(instruction) ? (
          instruction
        ) : (
          <Translate pt="Vamos aguardar os outros jogadores!" en="Please wait for the other players!" />
        )}
      </Instruction>
      {children}
      <ReadyPlayersBar players={players} />
    </div>
  );
}
