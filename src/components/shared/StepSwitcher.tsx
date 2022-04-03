import clsx from 'clsx';
// Components
import { WaitingRoom } from '.';
import { Loading } from 'components/loaders';
import { Translate } from 'components/language';

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
  children: any;
  step: number;
  conditions?: boolean[];
  players?: GamePlayers;
  waitingRoomInstructionType?: 'SERVER' | 'PLAYERS';
  waitingRoomInstruction?: any;
  waitingRoomContent?: any;
};

export function StepSwitcher({
  children,
  step,
  conditions,
  players,
  waitingRoomInstruction,
  waitingRoomInstructionType = 'PLAYERS',
  waitingRoomContent = '',
}: StepSwitcherProps) {
  if (!players) console.warn('SetSwitcher is being used without `players`, please add it.');

  if (players && step >= children.length) {
    return (
      <WaitingRoom
        players={players}
        title={<Translate pt="Pronto!" en="Done!" />}
        instruction={waitingRoomInstruction ?? getWaitingRoomInstruction(waitingRoomInstructionType)}
      >
        {waitingRoomContent}
      </WaitingRoom>
    );
  }

  if (!children[step]) {
    return <Loading />;
  }

  if (conditions?.[step] ?? true) {
    return children[step];
  }

  return <div></div>;
}

type StepProps = {
  children: any;
  fullWidth?: boolean;
  className?: string;
};

export function Step({ children, fullWidth = false, className }: StepProps) {
  return <div className={clsx('step', fullWidth && 'step--full-width', className)}>{children}</div>;
}
