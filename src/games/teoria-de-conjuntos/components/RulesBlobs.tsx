import { Button, Popover } from 'antd';
import { Translate } from 'components/language';
import { ReactNode } from 'react';
import { DiagramTopic } from 'types/tdr';
import { DiagramExamples } from '../utils/types';
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
    <Translate
      en={
        <>
          The Venn diagram has {hasContext ? 'three' : 'two'} areas and each area has a secret rule.
          <br />
          The <CircleHighlight color="blue">blue area</CircleHighlight> has a rule related to the physical
          properties of the thing. <Examples examples={examples.attribute} title="Attribute Examples" />
          <br />
          The <CircleHighlight color="yellow">yellow area</CircleHighlight> has a rule related to the name of
          the thing, like spell, grammar or pronunciation.
          <Examples examples={examples.word} title="Word Examples" />
          {
            <>
              <br />
              The <CircleHighlight color="blue">blue area</CircleHighlight> has a rule related to the context
              of the thing, where you might find it or use it.{' '}
              <Examples examples={examples.context!} title="Context Examples" />
            </>
          }
        </>
      }
      pt={
        <>
          O diagrama de Venn tem {hasContext ? 'três' : 'duas'} áreas e cada área tem uma regra secreta.
          <br />A <CircleHighlight color="blue">área azul</CircleHighlight> tem uma regra relacionada às
          propriedades físicas da coisa.
          <Examples examples={examples.attribute} title="Exemplos de Atributo" />
          <br />A <CircleHighlight color="yellow">área amarela</CircleHighlight> tem uma regra relacionada ao
          nome da coisa, como ortografia ou pronúncia.{' '}
          <Examples examples={examples.word} title="Exemplos de Palavra" />
          {
            <>
              <br />A <CircleHighlight color="red">área vermelha</CircleHighlight> tem uma regra relacionada
              ao contexto da coisa, onde você pode encontrá-la ou usá-la.{' '}
              <Examples examples={examples.context!} title="Exemplos de Contexto" />
            </>
          }
        </>
      }
    />
  );
}

export function EvaluationRules() {
  return (
    <Translate
      en="The judge will evaluate the position of the item in the Venn diagram if it makes correctly the secret rules."
      pt="O juiz avaliará a posição do item no diagrama de Venn se ele fizer corretamente as regras secretas."
    />
  );
}
