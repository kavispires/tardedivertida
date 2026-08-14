// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { PhaseBetsState, SubmitBetsPayload } from './utils/types';
import { mockSkierBets } from './utils/mock';
import { ChipsHighlight } from './components/Highlights';
import { Mountain } from './components/Mountain';
import { Lodges } from './components/Lodges';
import { SkierBets } from './components/SkierBets';

type StepChooseLodgesProps = {
  /**
   * All players in the game
   */
  players: GamePlayers;
  /**
   * Current user player object
   */
  user: GamePlayer;
  /**
   * Turn order array
   */
  turnOrder: GameOrder;
  /**
   * The active skier player
   */
  skier: GamePlayer;
  /**
   * Mountain dilemmas array
   */
  mountain: PhaseBetsState['mountain'];
  /**
   * Array of lodges
   */
  lodges: PhaseBetsState['lodges'];
  /**
   * Callback to submit bets
   */
  onSubmitBets: (payload: SubmitBetsPayload) => void;
  /**
   * Type of bet (initial, boost, final)
   */
  betType: string;
  /**
   * Animation start position
   */
  animateFrom: number;
  /**
   * Animation direction
   */
  animateTo: 'left' | 'right' | null;
  /**
   * Type of skier bet (skiersBets or skiersBoost)
   */
  skierBetType: 'skiersBets' | 'skiersBoost';
} & Pick<StepProps, 'announcement'>;

export function StepChooseLodges({
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
  skierBetType,
}: StepChooseLodgesProps) {
  // Dev: Mock bets
  useMock(() => {
    onSubmitBets({ bets: mockSkierBets(user.chips ?? 0), betType: skierBetType });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Escolha cabanas"
          en="Choose lodges"
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Como esquiador você aposta em qual cabana terá o maior número total de fichas apostadas por
              todos os jogadores.
              <br />
              Você tem <ChipsHighlight>{user.chips}</ChipsHighlight> fichas para apostar. Cada ficha vale{' '}
              <PointsHighlight value={1} /> se você apostar na cabana mais popular.
              <br />
              <strong>BÔNUS:</strong> Você também ganha <PointsHighlight value={1} /> para cada cabana que
              você não coloca nenhuma ficha durante o jogo.
            </>
          }
          en={
            <>
              As a skier you bet on which lodge will have the most total chips bet by all players.
              <br />
              You have <ChipsHighlight>{user.chips}</ChipsHighlight> chips to bet. Each chip is worth{' '}
              <PointsHighlight value={1} /> if you bet on the most popular lodge.
              <br />
              <strong>BONUS:</strong> You also earn <PointsHighlight value={1} /> for each lodge you don't
              place any chips on during the game.
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

      <Lodges
        lodges={lodges}
        players={players}
        user={user}
        betType={betType}
      />

      <SkierBets
        key={user.chips}
        lodges={lodges}
        user={user}
        onSubmitBets={onSubmitBets}
        betType={skierBetType}
      />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={skier.id}
      />
    </Step>
  );
}
