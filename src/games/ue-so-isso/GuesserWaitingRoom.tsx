// Hooks
import { useLanguage } from '../../hooks';
// Components
import { translate, WaitingRoom } from '../../components/shared';

type GuesserWaitingRoomProps = {
  players: GamePlayers;
  instructionSuffix: {
    pt: string;
    en: string;
  };
};

export function GuesserWaitingRoom({ players, instructionSuffix }: GuesserWaitingRoomProps) {
  const language = useLanguage();

  const instructionPrefix = translate(
    'Aguarde os outros jogadores',
    'Please wait while the other players',
    language
  );

  return (
    <WaitingRoom
      players={players}
      title={translate('Você é o(a) adivinhador(a)', "You're the guesser", language)}
      instruction={`${instructionPrefix} ${instructionSuffix[language]}.`}
    />
  );
}
