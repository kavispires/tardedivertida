// Types
import type { GamePlayer } from 'types/game';
import type { SuspectCardData } from 'types/tdr';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Outcome, Status, THistoryEntry } from './utils/types';
import { OUTCOME } from './utils/constants';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Suspects } from './components/Suspects';
import { Summary } from './components/Summary';

type StepQuestionWaitingProps = {
  suspectsDict: Dictionary<SuspectCardData>;
  suspectsIds: UID[];
  previouslyEliminatedSuspects: string[];
  perpetratorId: UID;
  questioner: GamePlayer;
  isUserTheWitness: boolean;
  history: THistoryEntry[];
  status: Status;
  outcome: Outcome;
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
  outcome,
}: StepQuestionWaitingProps) {
  return (
    <Step announcement={announcement}>
      <StepTitle wait>
        {outcome === OUTCOME.FINAL_SHOWDOWN ? (
          <Translate
            pt="Prepare-se para a decisão final!"
            en="Get ready for the final decision!"
          />
        ) : (
          <Translate
            pt={<>Examine os suspeitos</>}
            en={<>Examine the suspects</>}
          />
        )}
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
