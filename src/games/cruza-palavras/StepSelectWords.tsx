import { sampleSize } from 'lodash';
// Ant Design Resources
import { Badge, Button } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
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
      sampleSize(deck, 10).reduce((acc: Dictionary<boolean>, c) => {
        acc[c.id] = true;
        return acc;
      }, {}),
    );
  };

  const onSelectAll = () => {
    setDict(
      deck.reduce((acc: Dictionary<boolean>, c) => {
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
              <TextCard>{card.text}</TextCard>
            </TransparentButton>
          );
        })}
      </SpaceContainer>

      <SpaceFloat>
        <Button
          onClick={onSelectAll}
          size="large"
        >
          <Translate
            pt="Selecionar todas"
            en="Select all"
          />
        </Button>
        <Button
          onClick={onRandomSelection}
          size="large"
        >
          <Translate
            pt="Selecionar aleatoriamente"
            en="Select randomly"
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
      </SpaceFloat>
    </Step>
  );
}
