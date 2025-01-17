// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import type { PhaseBetsState, SubmitBetsPayload } from './utils/types';
import { ChipsHighlight } from './components/Highlights';
import { TurnOrder } from 'components/players';
import { Mountain } from './components/Mountain';
import { Lodges } from './components/Lodges';
import { useMock } from 'hooks/useMock';
import { mockSkierBets } from './utils/mock';
import { SkierBets } from './components/SkierBets';

type StepChoosePlayersProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: GameOrder;
  skier: GamePlayer;
  mountain: PhaseBetsState['mountain'];
  lodges: PhaseBetsState['lodges'];
  onSubmitBets: (payload: SubmitBetsPayload) => void;
  betType: string;
  animateFrom: number;
  animateTo: 'left' | 'right' | null;
  playerBetType: 'skiersBets' | 'skiersBoost';
} & Pick<StepProps, 'announcement'>;

export function StepChoosePlayers({
  announcement,
  players,
  turnOrder,
  user,
  skier,
  mountain,
  lodges,
  onSubmitBets,
  betType,
  animateFrom,
  animateTo,
  playerBetType,
}: StepChoosePlayersProps) {
  // Dev: Mock bets
  useMock(() => {
    onSubmitBets({ bets: mockSkierBets(user.chips ?? 0, players, skier.id), betType: playerBetType });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Escolha jogadores" en="Choose players" />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Como esquiador você aposta ganha pontos baseado nos pontos que os outros jogadores ganharem.
              <br />
              Você tem <ChipsHighlight>{user.chips}</ChipsHighlight> fichas para apostar em quais jogadores
              você quer compartilhar pontos. Cada ficha vale 20% dos pontos que o jogador ganhar.
            </>
          }
          en={
            <>
              As a skier you bet and win points based on the points other players win.
              <br />
              You have <ChipsHighlight>{user.chips}</ChipsHighlight> chips to bet on which players you want to
              share points with. Each chip is worth 20% of the points the player wins.
            </>
          }
        />
      </RuleInstruction>

      <Mountain
        mountain={mountain}
        skier={skier}
        animateFrom={animateFrom}
        animateTo={animateTo}
        betType={betType}
        showLevel={3}
      />

      <Lodges lodges={lodges} players={players} user={user} betType={betType} />

      <SkierBets players={players} user={user} onSubmitBets={onSubmitBets} betType={playerBetType} />

      <TurnOrder players={players} order={turnOrder} activePlayerId={skier.id} />
    </Step>
  );
}
