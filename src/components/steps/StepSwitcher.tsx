// Components
import { WaitingRoom } from 'components/players';
import { Loading } from 'components/loaders';
import { Translate } from 'components/language';
import { print } from 'utils/helpers';
import { ReactNode } from 'react';

const getWaitingRoomInstruction = (kind: string) => {
  switch (kind) {
    case 'SERVER':
      return (
        <Translate pt="Aguardando o servidor dar sinal de vida" en="Waiting for the server to resuscitate" />
      );
    case 'PLAYERS':
      return (
        <Translate
          pt="Vamos aguardar enquanto os outros jogadores terminam!"
          en="Please wait while other players finish!"
        />
      );

    default:
      return <Translate pt="Aguardando algo acontecer..." en="Waiting for something..." />;
  }
};

type StepSwitcherProps = {
  /**
   * The content of the component
   */
  children: JSX.Element[] | JSX.Element;
  /**
   * The current step
   */
  step: number;
  /*
   * The conditions to render each step, otherwise the waiting room is rendered
   */
  conditions?: boolean[];
  /**
   * The players dictionary
   */
  players?: GamePlayers;
  /**
   * Waiting room customizations
   */
  waitingRoom?: {
    /**
     * The type of waiting room (for players or server)
     */
    type?: 'SERVER' | 'PLAYERS';
    /**
     * The instruction to replace the default one
     */
    instruction?: ReactNode;
    /**
     * Additional content to be rendered
     */
    content?: ReactNode;
  };
};

export function StepSwitcher({ children, step, conditions, players, waitingRoom = {} }: StepSwitcherProps) {
  if (!players) print('SetSwitcher is being used without `players`, please add it.', 'warn');

  const content = Array.isArray(children) ? children : [children];

  if (players && step >= content.length) {
    return (
      <WaitingRoom
        players={players}
        title={<Translate pt="Pronto!" en="Done!" />}
        instruction={waitingRoom.instruction ?? getWaitingRoomInstruction(waitingRoom.type ?? 'PLAYERS')}
      >
        {waitingRoom.content}
      </WaitingRoom>
    );
  }

  if (!content[step]) {
    return <Loading />;
  }

  if (conditions?.[step] ?? true) {
    return content[step];
  }

  return <div></div>;
}
