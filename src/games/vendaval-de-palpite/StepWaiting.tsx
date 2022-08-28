import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { useLanguage } from 'hooks/useLanguage';

type StepWaitingProps = {
  players: GamePlayers;
  instruction: any;
};

export function StepWaiting({ players, instruction }: StepWaitingProps) {
  const { translate } = useLanguage();

  return (
    <Step fullWidth>
      <WaitingRoom players={players} title={translate('Aguarde', 'Please wait')} instruction={instruction} />
    </Step>
  );
}
