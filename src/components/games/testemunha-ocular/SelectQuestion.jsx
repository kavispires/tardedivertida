import React from 'react';
// Design Resources
import { Button } from 'antd';
// Hooks

// Components
import { Card } from '../../cards';
import { ButtonContainer, Instruction, Title, Translate } from '../../shared';
import { LETTERS } from '../../../utils/constants';

export function SelectQuestion({ questions, onSelectQuestion, isLoading }) {
  return (
    <div>
      <Title>
        <Translate pt="Selecione uma pergunta!" en="Select a question" />
      </Title>
      <Instruction>
        <Translate
          pt="A testemunha responderá a pergunta sobre o  sobre criminoso. A pergunta que você não escolher será descartada."
          en="The witness will answer the question about the perpetrator. The unchosen question will be discarded."
        />{' '}
      </Instruction>

      <ButtonContainer className="t-select-question">
        {questions.map(({ question, id }, index) => {
          return (
            <Button
              key={id}
              type="text"
              className="t-select-question__button"
              size="large"
              onClick={() => onSelectQuestion(id)}
              disabled={isLoading}
            >
              <Card header={LETTERS[index]} randomColor>
                {question}
              </Card>
            </Button>
          );
        })}
      </ButtonContainer>
    </div>
  );
}
