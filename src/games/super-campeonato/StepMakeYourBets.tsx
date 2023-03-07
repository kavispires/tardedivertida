// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { mockBets } from './utils/mock';
// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { Brackets } from './components/Brackets';
import { BetsForm } from './components/BetsForm';
import { Challenge } from './components/Challenge';

type StepMakeYourBetsProps = {
  onSubmitBets: GenericFunction;
  challenge: TextCard;
  brackets: WBracket[];
  players: GamePlayers;
} & AnnouncementProps;

export function StepMakeYourBets({
  onSubmitBets,
  challenge,
  brackets,
  players,
  announcement,
}: StepMakeYourBetsProps) {
  useMock(() => {
    onSubmitBets(mockBets(brackets));
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        <Translate pt="Faça suas apostas!" en="Make your bets!" />
      </Title>

      <Challenge challenge={challenge} />

      <BetsForm brackets={brackets} onSubmitBets={onSubmitBets} />

      <Brackets brackets={brackets} activeTier="quarter" players={players} />
    </Step>
  );
}
