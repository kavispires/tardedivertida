// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { GroupAnswerEvaluationEntry, SubmitEvaluationsPayload } from './utils/types';
import { EvaluationGroup } from './components/EvaluationGroup';

type StepEvaluateGroupProps = {
  players: GamePlayers;
  user: GamePlayer;
  answersGroups: GroupAnswerEvaluationEntry[];
  answersGroupIndex: number;
  onSubmitCurrentEvaluations: (payload: SubmitEvaluationsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluateGroup({
  players,
  user,
  announcement,
  answersGroups,
  answersGroupIndex,
  onSubmitCurrentEvaluations,
}: StepEvaluateGroupProps) {
  const answersGroup = answersGroups[answersGroupIndex];

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Avaliação{' '}
              <TextHighlight>
                {answersGroupIndex + 1} / {answersGroups.length}
              </TextHighlight>
            </>
          }
          en={
            <>
              Evaluation{' '}
              <TextHighlight>
                {answersGroupIndex + 1} / {answersGroups.length}
              </TextHighlight>
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <TranslateTemplate
          en="If you think any of the answers is wrong, <strong>hit</strong> the check mark switch and submit wrong answers. <br/> Everyone who answered earns {letterPoints} and the first player who answered correctly earns additional {topicPoints}."
          pt="Se você acha que alguma não está certa dentro da categoria e letra, <strong>aperte</strong> o botãozinho para marcar como errado. <br/> Todos que responderam ganham {letterPoints} e o primeiro jogador que respondeu corretamente ganha {topicPoints} adicionais."
          values={{
            br: <br />,
            strong: (text) => <strong>{text}</strong>,
            letterPoints: <PointsHighlight value={answersGroup.letter.level} />,
            topicPoints: <PointsHighlight value={answersGroup.topic.level} />,
          }}
        />
      </RuleInstruction>

      <EvaluationGroup
        key={answersGroupIndex} // To trigger a re-render
        answersGroup={answersGroup}
        players={players}
        user={user}
        onSubmitCurrentEvaluations={onSubmitCurrentEvaluations}
        answersGroupIndex={answersGroupIndex}
      />
    </Step>
  );
}
