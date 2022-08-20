// Hooks
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { useLanguage } from 'hooks/useLanguage';
// Components

type GuesserWaitingRoomProps = {
  players: GamePlayers;
  instructionSuffix: {
    pt: string;
    en: string;
  };
};

export function GuesserWaitingRoom({ players, instructionSuffix }: GuesserWaitingRoomProps) {
  const { language, translate } = useLanguage();

  const instructionPrefix = translate('Aguarde os outros jogadores', 'Please wait while the other players');

  return (
    <Step fullWidth>
      <WaitingRoom
        players={players}
        title={translate('Você é o(a) adivinhador(a)', "You're the guesser")}
        instruction={`${instructionPrefix} ${instructionSuffix[language]}.`}
      />
    </Step>
  );
}
