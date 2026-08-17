// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { DiagramArea, DiagramExamples, Guess, Solutions, SubmitEvaluationPayload } from './utils/types';
import { getPlayerItemsLeft } from './utils/helper';
import { DiagramRules, EvaluationRules } from './components/RulesBlobs';
import { MyThings } from './components/MyThings';
import { EvaluationModal } from './components/EvaluationModal';
import { DiagramSection } from './components/DiagramSection';
import { PlayerGuess } from './components/PlayerGuess';
import { RoundAlert } from './components/RoundAlert';

type StepEvaluateProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<ItemData>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  judge: GamePlayer;
  isTheJudge: boolean;
  onSubmitEvaluation: (payload: SubmitEvaluationPayload) => void;
  currentGuess: Guess;
  solutions: Solutions;
  targetItemCount: number;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluate({
  players,
  user,
  announcement,
  examples,
  diagrams,
  items,
  turnOrder,
  activePlayer,
  judge,
  isTheJudge,
  onSubmitEvaluation,
  solutions,
  currentGuess,
  targetItemCount,
  round,
}: StepEvaluateProps) {
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  const item = items[currentGuess.itemId];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <div
        ref={ref}
        style={{ width: '100%' }}
      />
      <StepTitle wait>
        <Translate
          pt="{judge} está avaliando a posição da coisa"
          en="{judge} is evaluating the thing's position"
          values={{
            judge: <PlayerAvatarName player={judge} />,
          }}
        />
      </StepTitle>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      {isTheJudge ? (
        <EvaluationModal
          item={item}
          onSubmitEvaluation={(evaluation) => onSubmitEvaluation({ evaluation })}
          solutions={solutions}
        />
      ) : (
        <PlayerGuess
          item={item}
          currentGuess={currentGuess}
          activePlayer={activePlayer}
        />
      )}

      <RuleInstruction type="wait">
        <EvaluationRules />
      </RuleInstruction>

      <DiagramSection
        width={width}
        diagrams={diagrams}
        items={items}
        currentItem={!isTheJudge ? item : undefined}
      >
        {isTheJudge ? (
          <span />
        ) : (
          <MyThings
            hand={user.hand ?? []}
            items={items}
            total={targetItemCount}
            maxHeight={width * (diagrams?.C ? 1 : 0.7)}
          />
        )}
      </DiagramSection>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
