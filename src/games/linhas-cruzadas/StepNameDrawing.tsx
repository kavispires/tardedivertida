import { useState } from 'react';
// Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage, useMock } from '../../hooks';
// Components
import {
  AvatarName,
  ButtonContainer,
  CanvasSVG,
  Instruction,
  Step,
  Title,
  Translate,
} from '../../components';

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

      <CanvasSVG drawing={currentPrompt.content} className="l-drawing" size={300} />

      <Input
        onChange={onTitleChange}
        size="large"
        placeholder={translate('Escreva seu chute aqui', 'Write your guess here')}
        className="l-drawing-guess-input"
        onPressEnter={onSubmitTitle}
      />

      <ButtonContainer>
        <Button type="primary" onClick={onSubmitTitle} size="large" disabled={!title}>
          <Translate pt="Enviar" en="Submit name" />
        </Button>
      </ButtonContainer>
    </Step>
  );
}