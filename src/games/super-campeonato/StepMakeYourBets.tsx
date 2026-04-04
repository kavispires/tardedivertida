// Types
import type { GamePlayers } from 'types/game';
import type { TextCard } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { Translate } from 'components/language/Translate';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Bracket, SubmitBetsPayload } from './utils/type';
import { mockBets } from './utils/mock';
import { Brackets } from './components/Brackets';
import { BetsForm } from './components/BetsForm';
import { Challenge } from './components/Challenge';

type StepMakeYourBetsProps = {
  onSubmitBets: (payload: SubmitBetsPayload) => void;
  challenge: TextCard;
  brackets: Bracket[];
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Faça suas apostas!"
          en="Make your bets!"
        />
      </StepTitle>

      <Challenge challenge={challenge} />

      <BetsForm
        brackets={brackets}
        onSubmitBets={onSubmitBets}
      />

      <Brackets
        brackets={brackets}
        activeTier="quarter"
        players={players}
      />
    </Step>
  );
}
