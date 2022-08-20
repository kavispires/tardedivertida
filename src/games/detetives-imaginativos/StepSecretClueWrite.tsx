import { useState } from 'react';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { FloatingHand, ImageCardHand } from 'components/cards';
// Components

type SecretClueWriteProps = {
  onSubmitClue: GenericFunction;
  user: GamePlayer;
};

export function StepSecretClueWrite({ user, onSubmitClue }: SecretClueWriteProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onButtonClick = () => {
    onSubmitClue({
      clue,
    });
  };

  const onEnterInput = (e: any) => {
    if (e.key === 'Enter') {
      onButtonClick();
    }
  };

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Escreva a Pista!" en="Write a Clue!" />
      </Title>
      <Instruction contained>
        <ul>
          <li>
            <Translate
              pt="Escreva uma pista que relacione com duas das suas cartas."
              en="Write a clue that relates to two of your cards."
            />
          </li>
          <li>
            <Translate
              pt="A pista pode ser qualquer coisa que você quiser. Não há restrições!"
              en="The clue can be anything you want. There are no restrictions!"
            />
          </li>
          <li>
            <Translate
              pt="Você ganha pontos somente se o Impostor não for encontrado, então escolha algo fácil e generalizado."
              en="You only get points if the Impostor is not found by the others, so choose something easy and general."
            />
          </li>
        </ul>
      </Instruction>

      <Space className="space-container" align="center">
        <Input
          className="uppercase-input"
          placeholder={translate('Escreva sua pista aqui', 'Write your clue here')}
          onChange={(e) => setClue(e.target.value)}
          onKeyPress={onEnterInput}
        />

        <Button type="primary" disabled={isLoading || clue.length < 1} onClick={onButtonClick}>
          <Translate pt="Enviar pista secreta" en="Send secret clue" />
        </Button>
      </Space>

      <FloatingHand>
        <ImageCardHand hand={user.hand} sizeRatio={6} />
      </FloatingHand>
    </Step>
  );
}
