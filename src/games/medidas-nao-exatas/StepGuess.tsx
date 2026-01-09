import { sample } from 'lodash';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
import { TimerBar } from 'components/timers';
// Internal
import type { Guess, SubmitGuessPayload } from './utils/types';
import { GUESSING_TIME } from './utils/constants';
import { mockGuess } from './utils/mock';
import { MetricsBoard } from './components/MetricsBoard';
import { GuessBrackets } from './components/GuessBrackets';

type StepGuessProps = {
  players: GamePlayers;
  user: GamePlayer;
  round: GameRound;
  isThePresenter: boolean;
  turnOrder: GameOrder;
  wordsDict: Dictionary<TextCard>;
  poolIds: CardId[];
  secretWordId: CardId;
  metricsDescriptors: Record<string, TextCard[]>;
  metrics: Record<string, number>;
  pointsBrackets: number[];
  onSubmitGuess: (payload: SubmitGuessPayload) => void;
  onMakeMeReady: () => void;
};

export function StepGuess({
  players,
  user,
  round,
  isThePresenter,
  wordsDict,
  poolIds,
  secretWordId,
  metricsDescriptors,
  metrics,
  pointsBrackets,
  onSubmitGuess,
  onMakeMeReady,
}: StepGuessProps) {
  const { isLoading } = useLoading();
  const guesses: Guess[] = user.guesses || [];
  const { timeLeft } = useCountdown({
    duration: GUESSING_TIME,
    // If no guesses, make a random guess
    onExpire: () => {
      // If ready or the presenter, do nothing
      if (user.ready || isThePresenter || guesses.length >= 2) return;
      // If no guesses, make a random guess
      if (!guesses.length) {
        const randomCardId = sample(poolIds) || poolIds[0];
        onSubmitGuess({
          guesses: [...guesses, { cardId: randomCardId, level: 5, timestamp: GUESSING_TIME }],
        });
      }
      // Otherwise just make it ready
      onMakeMeReady();
    },
  });

  const level = getLevel(timeLeft);

  useMock(() => onSubmitGuess(mockGuess(poolIds, secretWordId)));

  return (
    <Step fullWidth>
      <StepTitle size="small">
        <Translate
          pt="Qual a palavra secreta?"
          en="Which will be the secret word?"
        />
      </StepTitle>

      {isThePresenter ? (
        <RuleInstruction type="action">
          <Translate
            en="Wait while the players guess the secret word:"
            pt="Aguarde enquanto os jogadores adivinham a palavra secreta:"
          />{' '}
          <TextHighlight>{wordsDict[secretWordId]?.text || '...'}</TextHighlight>
        </RuleInstruction>
      ) : (
        <RuleInstruction type="action">
          {guesses.length === 0 && (
            <Translate
              en="Select the secret word."
              pt="Selecione a palavra secreta."
            />
          )}
          {guesses.length === 1 && (
            <Translate
              en={
                <>
                  If you change your mind, you can choose a different word, but you will lower your points and
                  receive a <PointsHighlight type="negative">1 point</PointsHighlight> penalty.
                </>
              }
              pt={
                <>
                  Se você mudar de ideia, pode escolher uma palavra diferente, mas perderá pontos e receberá
                  uma penalidade de <PointsHighlight type="negative">1 ponto</PointsHighlight>.
                </>
              }
            />
          )}
          {guesses.length === 2 && (
            <Translate
              en="Wait while the other players make their guesses."
              pt="Aguarde enquanto os jogadores fazem seus palpites."
            />
          )}
        </RuleInstruction>
      )}

      <Flex
        wrap="wrap"
        gap={8}
        className="mb-4"
        justify="center"
      >
        {poolIds.map((cardId) => (
          <TransparentButton
            key={cardId}
            onClick={() =>
              onSubmitGuess({
                guesses: [...guesses, { cardId, level, timestamp: Math.max(GUESSING_TIME - timeLeft, 0) }],
              })
            }
            disabled={isLoading || user.ready || isThePresenter || guesses.length === 2}
            active={guesses.some((g) => g.cardId === cardId)}
          >
            <Card
              key={cardId}
              hideHeader
            >
              {wordsDict[cardId].text}
            </Card>
          </TransparentButton>
        ))}
      </Flex>

      <div className="m-guessing-board">
        <MetricsBoard
          metricsDescriptors={metricsDescriptors}
          evaluations={metrics}
          level={level}
        />
        <GuessBrackets
          players={players}
          pointsBrackets={pointsBrackets}
        />
      </div>

      <TimerBar
        value={timeLeft}
        total={GUESSING_TIME}
        status="normal"
      />

      <NextPhaseIfAllPlayersHaveGuessed
        players={players}
        round={round}
      />
    </Step>
  );
}

const getLevel = (timeLeft: number) => {
  const levels: Record<number, number> = {
    12: 1,
    11: 2,
    10: 3,
    9: 4,
    8: 5,
  };
  return levels[Math.ceil(timeLeft / 10)] || 5;
};

type NextPhaseIfAllPlayersHaveGuessedProps = {
  players: GamePlayers;
  round: GameRound;
};

function NextPhaseIfAllPlayersHaveGuessed({ players, round }: NextPhaseIfAllPlayersHaveGuessedProps) {
  const allPlayed = Object.values(players).every((player) => {
    return player.ready || player.guesses?.length > 0;
  });
  if (!allPlayed) {
    return null;
  }

  return <HostNextPhaseButton round={round} />;
}
