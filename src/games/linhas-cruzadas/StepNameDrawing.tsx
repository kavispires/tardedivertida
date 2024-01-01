import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Types
import type { Prompt } from './utils/types';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { CanvasSVG } from 'components/canvas';

type StepNameDrawingProps = {
  currentPrompt: Prompt;
  onSubmitGuess: GenericFunction;
  players: GamePlayers;
  // for mock
  user: GamePlayer;
  round: GameRound;
};

export function StepNameDrawing({
  currentPrompt,
  onSubmitGuess,
  players,
  user,
  round,
}: StepNameDrawingProps) {
  const { translate } = useLanguage();
  const [title, setTitle] = useState<string>('');

  const author = players[currentPrompt.author];

  const onTitleChange = (e: any) => setTitle(e.target.value);

  const onSubmitTitle = () => onSubmitGuess({ guess: title });

  // DEV: Auto write
  useMock(() => onSubmitGuess({ guess: `${round.current}${user.id}` }), []);

  return (
    <Step>
      <Title>
        <Translate pt="O que é isso?" en="What is this?" />
      </Title>
      <Instruction contained>
        <Translate
          pt={
            <>
              <AvatarName player={author} /> desenhou isso, o que é?
            </>
          }
          en={
            <>
              <AvatarName player={author} /> draw this, so what is it?
            </>
          }
        />
      </Instruction>

      <CanvasSVG drawing={currentPrompt.content} className="l-drawing" width={300} />

      <Input
        onChange={onTitleChange}
        size="large"
        placeholder={translate('Escreva seu chute aqui', 'Write your guess here')}
        className="l-drawing-guess-input"
        onPressEnter={onSubmitTitle}
      />

      <Space className="space-container" align="center">
        <Button type="primary" onClick={onSubmitTitle} size="large" disabled={!title}>
          <Translate pt="Enviar" en="Submit name" />
        </Button>
      </Space>
    </Step>
  );
}
