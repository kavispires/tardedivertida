import clsx from 'clsx';
// Components
import { Translate, WaitingRoom } from '.';
import { Loading } from '..';

type StepSwitcherProps = {
  children: any;
  step: number;
  conditions?: boolean[];
  players?: GamePlayers;
};

export function StepSwitcher({ children, step, conditions, players }: StepSwitcherProps) {
  if (players && step === children.length) {
    return (
      <WaitingRoom
        players={players}
        title={<Translate pt="Pronto!" en="Done!" />}
        instruction={
          <Translate
            pt="Aguardando o servidor dar sinal de vida"
            en="Waiting for the server to resuscitate"
          />
        }
      />
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
