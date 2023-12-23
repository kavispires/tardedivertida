import { sampleSize } from 'lodash';
// Ant Design Resources
import { Badge, Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Card } from 'components/cards';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { TransparentButton } from 'components/buttons';

type StepSelectWordsProps = {
  user: GamePlayer;
  deck: TextCard[];
  onSubmitWords: GenericFunction;
} & AnnouncementProps;

export function StepSelectWords({ deck, onSubmitWords, user, announcement }: StepSelectWordsProps) {
  const { isLoading } = useLoading();
  const { updateDict, length, keys } = useBooleanDictionary({});

  useMock(() => {
    onSubmitWords({ words: sampleSize(deck, 12).map((c) => c.id) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Quais cards deveriam estar no jogo?" en="What cards should be in the game?" />
      </Title>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Selecione</strong> pelo 10 cartas para estar no jogo.
              <br />
              Quanto mais melhor!
            </>
          }
          en={
            <>
              <strong>Select</strong> at least 10 cards to be in the game.
              <br />
              The more the merrier!
            </>
          }
        />
      </RuleInstruction>

      <Space className="space-container">
        <Badge count={length}>
          <Button
            type="primary"
            onClick={() => onSubmitWords({ words: deck })}
            size="large"
            disabled={length < 10 || isLoading || user.ready}
          >
            <Translate pt="Enviar cartas" en="Submit cards" />
          </Button>
        </Badge>
      </Space>

      <Space className="space-container max-width" wrap>
        {deck.map((card) => {
          return (
            <TransparentButton
              key={card.id}
              onClick={() => updateDict(card.id)}
              active={keys.includes(card.id)}
            >
              <Card hideHeader>{card.text}</Card>
            </TransparentButton>
          );
        })}
      </Space>
    </Step>
  );
}
