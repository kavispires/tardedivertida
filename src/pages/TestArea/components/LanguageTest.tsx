// Components
import { Translate } from 'components/language';
import { LanguageButtons } from 'components/language/LanguageButtons';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
// Internal
import { DecisionButtons } from './DecisionButtons';
import type { TestStepProps } from '../TestArea';

export function LanguageTest({ onResult, step }: TestStepProps) {
  return (
    <SpaceContainer
      className="full-width"
      vertical
    >
      <Title
        level={2}
        size="small"
      >
        <Translate
          pt="Mudança de Idioma"
          en="Language Switch"
        />
      </Title>

      <Instruction contained>
        <span>This is the test area. To begin, choose your language:</span>
        <br />
        <span>Essa é a área de teste. Para começar, selecione seu idioma:</span>
      </Instruction>

      <LanguageButtons />

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: 'Você está vendo a página no idioma selecionado?',
          en: 'Are you seeing the page in the selected language?',
        }}
      />
    </SpaceContainer>
  );
}
