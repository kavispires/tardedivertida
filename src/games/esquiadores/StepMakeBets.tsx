// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseBetsState, SubmitBetsPayload } from './utils/types';
import { mockBets } from './utils/mock';
import { BET_TYPES } from './utils/constants';
import { ChipsHighlight } from './components/Highlights';
import { Mountain } from './components/Mountain';
import { Lodges } from './components/Lodges';

type StepMakeBetsProps = {
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
  catchUp?: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepMakeBets({
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
  catchUp,
}: StepMakeBetsProps) {
  // Dev: Mock
  useMock(() => {
    onSubmitBets({ bets: mockBets(user.chips ?? 0, animateFrom), betType });
  });

  let showLevel = -1;
  if (betType === BET_TYPES.BOOST) {
    showLevel = 0;
  }
  if (betType === BET_TYPES.FINAL) {
    showLevel = 1;
  }

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {betType === BET_TYPES.INITIAL && (
          <Translate
            pt="Faça suas apostas"
            en="Make your bets"
          />
        )}
        {betType === BET_TYPES.BOOST && (
          <Translate
            pt="Mais uma chance de melhorar suas apostas"
            en="Boost your bets"
          />
        )}
        {betType === BET_TYPES.FINAL && (
          <Translate
            pt="Última chance de apostar"
            en="Last chance to bet"
          />
        )}
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              O(A) skier <PlayerAvatarName player={skier} /> está descendo essa montanha e finalizará em uma
              das cabanas. Qual cabana você acha que ele(a) vai escolher?
              <br />
              Você tem <ChipsHighlight>{user.chips}</ChipsHighlight> fichas para apostar. Cada ficha vale{' '}
              <PointsHighlight>1 ponto</PointsHighlight> se você acertar a cabana escolhida.
              <br />
              <strong>BÔNUS:</strong> Você também ganha <PointsHighlight>1 ponto</PointsHighlight> para cada
              cabana que você não aposta nada, então você vai preferir distribuir os pontos ou focar em
              somente algumas?
            </>
          }
          en={
            <>
              The skier <PlayerAvatarName player={skier} /> is skiing down this mountain and will finish in
              one of the lodges. Which lodge do you think they will choose?
              <br />
              You have <ChipsHighlight>{user.chips}</ChipsHighlight> chips to bet. Each chip is worth{' '}
              <PointsHighlight>1 point</PointsHighlight>
              if you guess the chosen lodge.
              <br />
              <strong>BONUS:</strong> You also earn <PointsHighlight>1 point</PointsHighlight> for each lodge
              you don't bet on, so will you prefer to distribute the points or focus on just a few?
            </>
          }
        />
        {betType === BET_TYPES.INITIAL && catchUp && catchUp.length > 0 && (
          <>
            <br />
            <Translate
              pt={
                <>
                  <strong>ATENÇÃO:</strong> Já que {catchUp.map((pId) => players[pId].name).join(', ')}{' '}
                  está(ão) em último, ele(s) tem <ChipsHighlight>2 fichas</ChipsHighlight> a mais.
                </>
              }
              en={
                <>
                  <strong>ATTENTION:</strong> Since {catchUp.map((pId) => players[pId].name).join(', ')} are
                  last, they have <ChipsHighlight>2 more chips</ChipsHighlight>.
                </>
              }
            />
          </>
        )}
      </RuleInstruction>

      <Mountain
        mountain={mountain}
        skier={skier}
        animateFrom={animateFrom}
        animateTo={animateTo}
        showLevel={showLevel}
      />

      <Lodges
        key={user.chips}
        lodges={lodges}
        players={players}
        user={user}
        onSubmitBets={onSubmitBets}
        betType={betType}
      />

      <DevButton onClick={() => onSubmitBets({ bets: mockBets(user.chips ?? 0, animateFrom), betType })}>
        Mock Bets
      </DevButton>

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={skier.id}
      />
    </Step>
  );
}
