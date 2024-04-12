import { ReactNode } from 'react';
import { Button, Popover } from 'antd';
// Types
import { DiagramTopic } from 'types/tdr';
// Utils
import { DiagramExamples } from '../utils/types';
// Components
import { Translate } from 'components/language';
import { RuleInstruction, TextHighlight } from 'components/text';
import { CircleHighlight } from './Highlights';

type ExamplesProps = {
  examples: DiagramTopic[];
  title: ReactNode;
};

function Examples({ examples, title }: ExamplesProps) {
  const content = (
    <ul>
      {examples.map((example) => (
        <li key={example.id}>- {example.text}.</li>
      ))}
    </ul>
  );

  return (
    <Popover content={content} title={title}>
      <Button type="link">
        <Translate en="See examples" pt="Ver exemplos" />
      </Button>
    </Popover>
  );
}

type DiagramRulesProps = {
  examples: DiagramExamples;
};

export function DiagramRules({ examples }: DiagramRulesProps) {
  const hasContext = Boolean(examples.context);
  return (
    <RuleInstruction type="rule">
      <Translate
        en={
          <>
            The Venn diagram has {hasContext ? 'three' : 'two'} areas and each area has a secret rule.
            <br />
            The <CircleHighlight color="blue">blue area</CircleHighlight> has a rule related to an{' '}
            <TextHighlight>Attribute</TextHighlight> of the thing, like its physical properties.{' '}
            <Examples examples={examples.attribute} title="Attribute Examples" />
            <br />
            The <CircleHighlight color="yellow">yellow area</CircleHighlight> has a rule related to the{' '}
            <TextHighlight>word</TextHighlight>: the name of the thing, spelling, grammar or pronunciation.
            <Examples examples={examples.word} title="Word Examples" />
            {
              <>
                <br />
                The <CircleHighlight color="red">red area</CircleHighlight> has a rule related to the{' '}
                <TextHighlight>context</TextHighlight>
                of the thing, where you might find it or use it.{' '}
                <Examples examples={examples.context!} title="Context Examples" />
              </>
            }
          </>
        }
        pt={
          <>
            O diagrama tem {hasContext ? 'três' : 'duas'} áreas e cada área tem uma regra secreta.
            <br />A <CircleHighlight color="blue">área azul</CircleHighlight> tem uma regra relacionada a um{' '}
            <TextHighlight>Atributo</TextHighlight> da coisa, como suas propriedades físicas.{' '}
            <Examples examples={examples.attribute} title="Exemplos de Atributos" />
            <br />A <CircleHighlight color="yellow">área amarela</CircleHighlight> tem uma regra relacionada à{' '}
            <TextHighlight>palavra</TextHighlight>: o nome da coisa, grafia, gramática ou pronúncia.
            <Examples examples={examples.word} title="Exemplos de Palavras" />
            {
              <>
                <br />A <CircleHighlight color="red">área vermelha</CircleHighlight> tem uma regra relacionada
                ao <TextHighlight>contexto</TextHighlight> da coisa, onde você pode encontrá-la ou usá-la.{' '}
                <Examples examples={examples.context!} title="Exemplos de Contexto" />
              </>
            }
          </>
        }
      />
    </RuleInstruction>
  );
}

export function EvaluationRules() {
  return (
    <Translate
      en="The judge will evaluate the position of the thing in the Venn diagram if it makes correctly the secret rules."
      pt="O juiz avaliará a posição da coisa no diagrama de Venn se ele fizer corretamente as regras secretas."
    />
  );
}
