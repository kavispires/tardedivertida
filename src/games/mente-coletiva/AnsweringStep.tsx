import { useEffect, useState } from 'react';
// Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { getEntryId, isDevEnv, shuffle } from '../../utils/helpers';
// Components
import { ButtonContainer, PopoverRule, Step, Title, translate, Translate } from '../../components';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';
import { Question } from './Question';
import { AnsweringRules } from './RulesBlobs';

const mockAnswers = (userId: PlayerId, numAnswers: number) => {
  const list = ['agua', 'bola', 'coco', 'dedo', 'egua', 'flauta', 'gatilho', 'hélio', 'jaguar'];
  const list2 = ['água', 'bola', 'cocô', 'dedo', 'égua', 'flauta', 'gatilho', 'helio', 'jipe'];
  // const list = ['abacaxi', 'maça', 'pera', 'mamão', 'manga', 'tomate'];
  // const list2 = ['abacaxi', 'macã', 'pêra', 'pêssego', 'manga', 'melancia'];

  const shuffled = shuffle(Math.random() > 0.5 ? list : list2);

  return Array(numAnswers)
    .fill(0)
    .map((i, index) => ({ [getEntryId(['answer', `${index}`, userId])]: shuffled[i + index] }))
    .reduce((acc, item) => {
      acc = { ...acc, ...item };
      return acc;
    }, {});
};

type AnsweringStepProps = {
  currentQuestion: MQuestion;
  onSubmitAnswers: GenericFunction;
  players: GamePlayers;
  roundType: number;
  user: GamePlayer;
};

export function AnsweringStep({
  user,
  currentQuestion,
  players,
  roundType,
  onSubmitAnswers,
}: AnsweringStepProps) {
  const language = useLanguage();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (isDevEnv) {
      onSubmitAnswers({ answers: mockAnswers(user.id, currentQuestion.number) });
    }
  }, []); // eslint-disable-line

  const onWriteAnswer = (e: any) => {
    setAnswers((s) => ({
      ...s,
      [e.target.id]: e.target.value.toUpperCase().trim(),
    }));
  };

  const isDisabled =
    Object.keys(answers).length < currentQuestion.number ||
    new Set(Object.values(answers)).size !== currentQuestion.number;

  const onPressEnter = () => {
    if (!isDisabled) {
      onSubmitAnswers({ answers });
    }
  };

  return (
    <Step fullWidth>
      <div className="m-step__contained-content">
        <Title level={3}>
          <Translate pt="Responda a pergunta:" en="Answer the question:" />
          <Question question={currentQuestion} />
        </Title>

        <PopoverRule content={<AnsweringRules />} />

        <ol className="m-answers">
          {Array(currentQuestion.number)
            .fill(1)
            .map((i, index) => {
              const num = i + index;
              const key = `answer-${index}`;
              const id = getEntryId(['answer', index, user.id]);
              return (
                <li className="m-answers__item" key={key}>
                  <Input
                    className="m-answers__input"
                    id={id}
                    placeholder={translate(
                      `Escreva a resposta ${num} aqui`,
                      `Write answer ${num} here`,
                      language
                    )}
                    autoComplete="off"
                    onChange={onWriteAnswer}
                    onPressEnter={onPressEnter}
                  />
                </li>
              );
            })}
        </ol>
        <ButtonContainer>
          <Button type="primary" disabled={isDisabled} onClick={() => onSubmitAnswers({ answers })}>
            <Translate pt="Enviar respostas" en="Submit answers" />
          </Button>
        </ButtonContainer>
      </div>

      <RoundType roundType={roundType} />

      <Pasture players={players} />
    </Step>
  );
}
