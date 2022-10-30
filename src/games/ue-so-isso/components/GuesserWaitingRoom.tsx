// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';

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
        title={<Translate pt="Você é o(a) adivinhador(a)" en="You're the guesser" />}
        instruction={`${instructionPrefix} ${instructionSuffix[language]}.`}
      />
    </Step>
  );
}
