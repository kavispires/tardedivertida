// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Components
import { Translate } from 'components/language';
import { PlayerAvatarName } from 'components/player';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Status, THistoryEntry } from './utils/types';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Suspects } from './components/Suspects';
import { Summary } from './components/Summary';

type StepQuestionWaitingProps = {
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  previouslyEliminatedSuspects: string[];
  perpetratorId: CardId;
  questioner: GamePlayer;
  isUserTheWitness: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepQuestionWaiting({
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  perpetratorId,
  questioner,
  isUserTheWitness,
  history,
  announcement,
  status,
}: StepQuestionWaitingProps) {
  return (
    <Step announcement={announcement}>
      <StepTitle wait>
        <Translate
          pt={<>Examine os suspeitos</>}
          en={<>Examine the suspects</>}
        />
      </StepTitle>
      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              <PlayerAvatarName player={questioner} /> está escolhendo uma pergunta para essa rodada.
            </>
          }
          en={
            <>
              <PlayerAvatarName player={questioner} /> is picking a question for this round.
            </>
          }
        />{' '}
      </RuleInstruction>

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && (
        <QuestionsHistory
          history={history}
          suspectsDict={suspectsDict}
        />
      )}

      {status && <Summary status={status} />}
    </Step>
  );
}
