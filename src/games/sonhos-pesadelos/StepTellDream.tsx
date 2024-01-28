import { useState } from 'react';
// Ant Design Resources
import { Button, Input, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockDream } from './utils/mock';
// Components
import { DreamBoard } from './components/DreamBoard';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Card } from 'components/cards';
import { Translate } from 'components/language';

type StepTellDreamProps = {
  players: GamePlayers;
  table: ImageCardId[];
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
          header={translate('Tema do Sonho', 'Dream Theme')}
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
          pt="Dentro do tema acima, escreva sua dica no campo abaixo. Lembre-se que seu sonho é a carta de borda amarela e seu pesadelo é a carta de borda roxa."
          en="Write a clue in the field below within the given theme. Remember that your dream is the card with the yellow border and your nightmare is the card with the purple border."
        />
      </Instruction>

      <DreamBoard table={table} user={user} />

      <Space className="space-container" align="center">
        <Input
          size="large"
          onPressEnter={onSubmitDreamsClick}
          onChange={(e) => setDream(e.target.value)}
          placeholder={translate('Escreva aqui', 'Write here')}
        />
      </Space>

      <Space className="space-container" align="center">
        <Button type="primary" disabled={isLoading || !Boolean(dream)} onClick={onSubmitDreamsClick}>
          <Translate pt="Enviar Sonho" en="Submit Dream" />
        </Button>
      </Space>
    </Step>
  );
}
