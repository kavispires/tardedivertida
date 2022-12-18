import { Button, Input, Space } from 'antd';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useState } from 'react';
import { MinigameTitle } from './MinigameTitle';
import { mockText } from '../utils/mock';

export const TaskUeSoIsso = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onSubmitClue = () => {
    if (clue.length > 1 && clue.toLowerCase() !== task.data.card.text.toLowerCase()) {
      onSubmitTask({
        data: { value: clue },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockText() },
    });
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Num jogo normal de Ué, Só Isso, você está tentando dar uma dica que não seja igual a dos outros
              jogadores para que sua dica não seja eliminada.
              <br />
              Dessa vez, você <strong>quer que sua dica seja eliminada</strong>, seja bem óbvio!
            </>
          }
          en={
            <>
              In a normal game of That's it?, you are trying to write a clue that is not the same as other
              players so it doesn't get removed.
              <br />
              This time, you <strong>want your clue to be eliminated</strong>so be very obvious!
            </>
          }
        />
      </Instruction>
      <Space className="space-container">
        <Card color="purple" header={translate('A Palavra Secreta é', 'Secret Word')} size="large">
          {task.data.card.text}
        </Card>
      </Space>

      <Space className="space-container" direction="vertical">
        <SuggestionEasel
          id={user.id}
          onChangeInput={(e) => setClue(e.target.value)}
          onPressEnter={onSubmitClue}
        />
        <Button
          shape="round"
          type="primary"
          disabled={user.ready || clue.length < 2 || clue.toLowerCase() === task.data.card.text.toLowerCase()}
          loading={isLoading}
          onClick={onSubmitClue}
        >
          <Translate pt="Selecionar" en="Select" />
        </Button>
      </Space>
    </>
  );
};

type SuggestionEaselProps = {
  id: string;
  onChangeInput?: GenericFunction;
  onPressEnter?: GenericFunction;
  value?: string;
};

export function SuggestionEasel({ id, onChangeInput, onPressEnter, value }: SuggestionEaselProps) {
  const { translate } = useLanguage();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 230 60"
      overflow="visible"
      width="230"
      className="u-suggestion-easel"
    >
      <path fill="#fff" d="M26.7 59.5L14.1.5h202.7l12.6 59z" />
      <path fill="#4d4d4d" d="M216.4 1l12.4 58H27.1L14.7 1h201.7m.8-1H13.5l12.8 60H230L217.2 0z" />
      <path fill="#4d4d4d" d="M24.2 48.3L13.5 0 0 48.3z" />
      <foreignObject x="32.6" y="13.9" width="185" height="300">
        <div>
          <Input
            placeholder={translate('Escreva dica aqui', 'Write here')}
            key={id}
            id={id}
            value={value}
            onChange={onChangeInput}
            className="u-suggestion-easel__input"
            bordered={false}
            onPressEnter={onPressEnter}
            autoComplete="off"
          />
        </div>
      </foreignObject>
      <path opacity=".2" d="M0 48.3L26.3 60l-2.1-11.7z" />
    </svg>
  );
}
