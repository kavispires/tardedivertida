// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { TextCard } from 'types/tdr';
// Hooks
import { useMock } from '@hooks/useMock';
// Components
import { Translate } from '@components/language/Translate';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Bracket, SubmitBetsPayload } from './utils/type';
import { mockBets } from './utils/mock';
import { Brackets } from './components/Brackets';
import { BetsForm } from './components/BetsForm';
import { Challenge } from './components/Challenge';
import { BetsFloatingHand } from './components/BetsFloatingHand';

type StepMakeYourBetsProps = {
  onSubmitBets: (payload: SubmitBetsPayload) => void;
  challenge: TextCard;
  brackets: Bracket[];
  players: GamePlayers;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepMakeYourBets({
  onSubmitBets,
  challenge,
  brackets,
  players,
  announcement,
  user,
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
        userContenders={user?.selectedContenderIds ?? []}
      />
      <Brackets
        brackets={brackets}
        activeTier="quarter"
        players={players}
      />

      <BetsFloatingHand
        bets={user?.bets ?? {}}
        brackets={brackets}
        selectedContenderIds={user?.selectedContenderIds ?? []}
      />
    </Step>
  );
}
