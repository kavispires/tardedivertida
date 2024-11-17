// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import { Status, THistoryEntry } from './utils/types';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Suspects } from './components/Suspects';
import { Summary } from './components/Summary';

type StepQuestionWaitingProps = {
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  perpetrator: SuspectCard;
  questioner: GamePlayer;
  isUserTheWitness: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepQuestionWaiting({
  suspects,
  previouslyEliminatedSuspects,
  perpetrator,
  questioner,
  isUserTheWitness,
  history,
  announcement,
  status,
}: StepQuestionWaitingProps) {
  return (
    <Step announcement={announcement}>
      <Title size="medium">
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />
        <br />
        <Translate pt={<>Examine os suspeitos</>} en={<>Examine the suspects</>} />
      </Title>
      <RuleInstruction type="wait">
        <Translate
          pt={
            <>
              <AvatarName player={questioner} /> está escolhendo uma pergunta para essa rodada.
            </>
          }
          en={
            <>
              <AvatarName player={questioner} /> is picking a question for this round.
            </>
          }
        />{' '}
        {isUserTheWitness && (
          <Translate
            pt="O criminoso que você viu está marcado com borda amarela"
            en="The criminal you saw is highlighted in yellow"
          />
        )}
      </RuleInstruction>

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && <QuestionsHistory history={history} />}

      {status && <Summary status={status} />}
    </Step>
  );
}
