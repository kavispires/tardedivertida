import { sampleSize } from 'lodash';
// Ant Design Resources
import { Badge, Button } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
import type { TextCardData } from 'types/tdr';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitWordsPayload } from './utils/types';

type StepSelectWordsProps = {
  user: GamePlayer;
  pool: TextCardData[];
  requiredWords: number;
  onSubmitWords: (payload: SubmitWordsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepSelectWords({
  pool,
  onSubmitWords,
  user,
  announcement,
  requiredWords,
}: StepSelectWordsProps) {
  const { updateDict, length, keys, setDict } = useBooleanDictionary({});

  useMock(() => {
    onSubmitWords({ selectedWordsIds: sampleSize(pool, requiredWords).map((c) => c.id) });
  });

  const onRandomSelection = () => {
    setDict(
      sampleSize(pool, requiredWords).reduce((acc: Dictionary<boolean>, c) => {
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
          pt="<strong>Selecione</strong> pelo menos {requiredWords} cartas para estar na rodada. Quanto mais melhor!
              <br />
              Prefira substantivos concretos porque os mais votados serão escolhidos para a rodada."
          en="<strong>Select</strong> at least {requiredWords} cards to be in the game. The more the merrier!<br />
              Prefer concrete nouns because the most voted will be chosen for the game."
          values={{
            requiredWords,
          }}
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
            onClick={() => onSubmitWords({ selectedWordsIds: keys })}
            size="large"
            disabled={length < requiredWords || user.ready}
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
        <div className="c-word-pool">
          {pool.map((card) => {
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
        </div>
      </SpaceContainer>
    </Step>
  );
}
