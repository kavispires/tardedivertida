import { sampleSize } from 'lodash';
// Ant Design Resources
import { Badge, Button } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton, TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitWordsPayload, TextCardWithType } from './utils/types';

type StepSelectWordsProps = {
  user: GamePlayer;
  deck: TextCardWithType[];
  onSubmitWords: (payload: SubmitWordsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectWords({ deck, onSubmitWords, user, announcement }: StepSelectWordsProps) {
  const { updateDict, length, keys, setDict } = useBooleanDictionary({});

  useMock(() => {
    onSubmitWords({ words: sampleSize(deck, 12).map((c) => c.id) });
  });

  const onRandomSelection = () => {
    setDict(
      sampleSize(deck, 10).reduce((acc: BooleanDictionary, c) => {
        acc[c.id] = true;
        return acc;
      }, {}),
    );
  };

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Quais cartas deveriam estar no jogo?"
          en="What cards should be in the game?"
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              <strong>Selecione</strong> pelo menos 10 cartas para estar no jogo.
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

      <SpaceContainer>
        <Button
          onClick={onRandomSelection}
          size="large"
        >
          <Translate
            pt="Selecione pra mim"
            en="Select for me"
          />
        </Button>
        <Badge count={length}>
          <SendButton
            onClick={() => onSubmitWords({ words: keys })}
            size="large"
            disabled={length < 10 || user.ready}
          >
            <Translate
              pt="Enviar cartas"
              en="Submit cards"
            />
          </SendButton>
        </Badge>
      </SpaceContainer>

      <SpaceContainer
        className="max-width"
        wrap
      >
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
      </SpaceContainer>
    </Step>
  );
}
