// Types
import type { TextCard } from 'types/tdr';
// Utils
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { SubmitWordPayload } from './utils/types';

type StepWordSelectionProps = {
  onSubmitWord: (payload: SubmitWordPayload) => void;
  words: TextCard[];
};

export function StepWordSelection({ onSubmitWord, words }: StepWordSelectionProps) {
  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Selecione o tema da rodada" en="Select the theme for the round" />
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              <strong>Clique</strong> em uma das palavras abaixo para selecionar.
              <br />A carta que você não escolher ficará para a próxima rodada.
            </>
          }
          en={
            <>
              <strong>Click</strong> on one of the words below to select.
              <br />
              The card you don't choose will stay in the pool for the next round.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        {words.map((word, index) => {
          return (
            <TransparentButton key={word.id} onClick={() => onSubmitWord({ wordId: word.id })}>
              <Card header={LETTERS[index]} color="purple">
                {word.text}
              </Card>
            </TransparentButton>
          );
        })}
      </SpaceContainer>
    </Step>
  );
}
