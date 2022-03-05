// Components
import { AvatarIcon, AvatarName, Instruction, Step, Title, Translate } from 'components';
import { QuestionsHistory } from './QuestionsHistory';
import { Suspects } from './Suspects';

type StepQuestionWaitingProps = {
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
  perpetrator: Suspect;
  questioner: GamePlayer;
  isUserTheWitness: boolean;
  history: THistoryEntry[];
};

export function StepQuestionWaiting({
  suspects,
  previouslyEliminatedSuspects,
  perpetrator,
  questioner,
  isUserTheWitness,
  history,
}: StepQuestionWaitingProps) {
  return (
    <Step>
      <Title>
        <AvatarIcon type="animated-clock" size="large" />
        <br />
        <Translate pt={<>Examine os suspeitos</>} en={<>Examine the suspects</>} />
      </Title>
      <Instruction contained>
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
      </Instruction>

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      <QuestionsHistory history={history} />
    </Step>
  );
}
