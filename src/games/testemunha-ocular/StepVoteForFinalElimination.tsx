import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from '@icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from '@icons/SpeechBubbleDeclinedIcon';
// Components
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { FinalEliminationPayload, Status, THistoryEntry } from './utils/types';
import { buildAnswer } from './utils/helpers';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepVoteForFinalEliminationProps = {
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: UID[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetratorId: UID;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  onSelectCriminal: (payload: FinalEliminationPayload) => void;
  question: TestimonyQuestionCard;
  testimony: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepVoteForFinalElimination({
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  eliminatedSuspects,
  perpetratorId,
  isUserTheWitness,
  witness,
  onSelectCriminal,
  question,
  testimony,
  history,
  announcement,
  status,
}: StepVoteForFinalEliminationProps) {
  const { translate, language } = useLanguage();

  const handleSelectCriminal = (suspectId: string) => onSelectCriminal({ suspectId });

  const answer = useMemo(() => {
    return buildAnswer(question, testimony, language);
  }, [question, testimony, language]);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <span>
          <PlayerAvatarName
            player={witness}
            addressUser
          />
          <Translate
            en="answered"
            pt="respondeu"
          />{' '}
          {testimony ? (
            <Translate
              en="YES"
              pt="SIM"
            />
          ) : (
            <Translate
              en="NO"
              pt="NÃO"
            />
          )}{' '}
          <Icon
            size="large"
            icon={testimony ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
          />{' '}
          <Translate
            en="to the question"
            pt="para a pergunta:"
          />
        </span>
      </StepTitle>

      <SpaceContainer align="center">
        <Card
          header={translate({ pt: 'O suspeito...', en: 'The perpetrator...' })}
          color={testimony ? 'green' : 'red'}
          className="t-card"
          size="large"
        >
          {answer}
        </Card>
      </SpaceContainer>

      {!isUserTheWitness ? (
        <RuleInstruction type="action">
          <Translate
            en={
              <>
                In a crazy turn of events, every detective needs to evaluate the two final suspects.
                <br /> And now{' '}
                <TextHighlight style={{ fontStyle: 'italic', fontSize: '1.2em' }}>
                  SELECT THE CRIMINAL
                </TextHighlight>
                !
                <br />
                In case of a tie, both are released and the group loses the game.
              </>
            }
            pt={
              <>
                Em uma reviravolta maluca, todos os detetives precisam avaliar os dois suspeitos finais.
                <br /> E agora{' '}
                <TextHighlight style={{ fontStyle: 'italic', fontSize: '1.2em' }}>
                  SELECIONE O CRIMINOSO
                </TextHighlight>
                !
                <br />
                Em caso de empate, ambos são liberados e o grupo perde o jogo.
              </>
            }
          />
        </RuleInstruction>
      ) : (
        <RuleInstruction type="wait">
          <Translate
            pt={
              <>
                Os jogadores agora devem individualmente votar pra quem é o criminoso!
                <br />O suspeito mais votado será preso.
                <br />
                Em caso de empate, ambos são liberados.
              </>
            }
            en={
              <>
                Players must now individually vote for who the criminal is!
                <br />
                The suspect with the most votes will be arrested!
                <br />
                In case of a tie, both are released.
              </>
            }
          />
        </RuleInstruction>
      )}

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        onCardClick={!isUserTheWitness ? handleSelectCriminal : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
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
