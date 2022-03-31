import { useState } from 'react';
// Ant Design Resources
import { Button, Input } from 'antd';
// Hooks
import { useLanguage, useLoading, useMock } from 'hooks';
// Utils
import { mockDream } from './mock';
// Components
import { Card, ButtonContainer, Instruction, ReadyPlayersBar, Step, Title, Translate } from 'components';
import { DreamBoard } from './DreamBoard';

type StepTellDreamProps = {
  players: GamePlayers;
  table: ImageCard[];
  user: GamePlayer;
  onSubmitDream: GenericFunction;
};

export function StepTellDream({ players, table, user, onSubmitDream }: StepTellDreamProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [dream, setDream] = useState('');

  // DEV: mocks clues
  useMock(() => {
    onSubmitDream({ dream: mockDream() });
  }, []);

  const onSubmitDreamsClick = () => {
    onSubmitDream({
      dream,
    });
  };

  return (
    <Step fullWidth className="s-tell-dream-step">
      <Title>
        <Card
          header={translate('Tema', 'Theme')}
          className="s-theme-card"
          randomColor
          footer={Array(user.theme.level).fill('•').join('')}
          footerClassName="s-theme-card__description"
        >
          {user.theme.text}
        </Card>
      </Title>
      <Instruction contained>
        <Translate
          pt="Escreva sua dica abaixo relacionada com o tema. Lembre-se que seu sonho é a carta de borda amarela e seu pesadelo é a carta de borda preta."
          en="Write a clue in the field below within the given theme. Remember that your dream is the card with yellow border and your nightmare is the card with black border"
        />
      </Instruction>

      <DreamBoard table={table} user={user} />

      <ButtonContainer>
        <Input
          size="large"
          onPressEnter={onSubmitDreamsClick}
          onChange={(e) => setDream(e.target.value)}
          placeholder={translate('Escreva aqui', 'Write here')}
        />
      </ButtonContainer>

      <ButtonContainer>
        <Button type="primary" disabled={isLoading || !Boolean(dream)} onClick={onSubmitDreamsClick}>
          <Translate pt="Enviar Sonho" en="Submit Dream" />
        </Button>
      </ButtonContainer>

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
