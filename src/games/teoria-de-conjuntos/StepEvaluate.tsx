// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { DiagramRules, EvaluationRules } from './components/RulesBlobs';
import { DiagramArea, DiagramExamples, Guess, Solutions, SubmitEvaluationPayload } from './utils/types';
import { Item } from 'types/tdr';
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { TurnOrder } from 'components/players';
import { AvatarName, IconAvatar } from 'components/avatars';
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { MyThings } from './components/MyThings';
import { EvaluationModal } from './components/EvaluationModal';
import { DiagramSection } from './components/DiagramSection';
import { PlayerGuess } from './components/PlayerGuess';
import { getPlayerItemsLeft } from './utils/helper';
import { GameRound } from 'types/game';
import { RoundAlert } from './components/RoundAlert';

type StepEvaluateProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  judge: GamePlayer;
  isJudge: boolean;
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
  isJudge,
  onSubmitEvaluation,
  solutions,
  currentGuess,
  targetItemCount,
  round,
}: StepEvaluateProps) {
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  const item = items[currentGuess.itemId];

  return (
    <Step fullWidth announcement={announcement}>
      <div ref={ref} style={{ width: '100%' }} />
      <Title>
        <Translate
          pt={
            <>
              <AvatarName player={judge} /> está avaliando a posição da coisa
            </>
          }
          en={
            <>
              <AvatarName player={judge} /> is evaluating the thing's position
            </>
          }
        />{' '}
        <IconAvatar icon={<AnimatedClockIcon />} />
      </Title>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      {isJudge ? (
        <EvaluationModal
          item={item}
          onSubmitEvaluation={(evaluation) => onSubmitEvaluation({ evaluation })}
          solutions={solutions}
        />
      ) : (
        <PlayerGuess item={item} currentGuess={currentGuess} activePlayer={activePlayer} />
      )}

      <DiagramSection
        width={width}
        diagrams={diagrams}
        items={items}
        currentItem={!isJudge ? item : undefined}
      />

      <RuleInstruction type="wait">
        <EvaluationRules />
      </RuleInstruction>

      {!isJudge && <MyThings hand={user.hand ?? []} items={items} total={targetItemCount} />}

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
