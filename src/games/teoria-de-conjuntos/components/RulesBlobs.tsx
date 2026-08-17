import type { ReactNode } from 'react';
// Ant Design Resources
import { Button, Popover } from 'antd';
// Types
import type { DiagramTopicData } from 'types/tdr';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { DiagramExamples } from '../utils/types';
import { CircleHighlight } from './Highlights';

type ExamplesProps = {
  examples: DiagramTopicData[];
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
    <Popover
      content={content}
      title={title}
    >
      <Button type="link">
        <Translate
          en="See examples"
          pt="Ver exemplos"
        />
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
        en="The Venn diagram has {areas} areas and each area has a secret rule."
        pt="O diagrama tem {areas} áreas e cada área tem uma regra secreta."
        values={{ areas: hasContext ? '3' : '2' }}
      />
      <br />

      <Translate
        en="The <area>blue area</area> has a rule related to an <highlight>Attribute</highlight> of the thing, like its physical properties."
        pt="A <area>área azul</area> tem uma regra relacionada a um <highlight>Atributo</highlight> da coisa, como suas propriedades físicas."
        values={{
          area: (content) => <CircleHighlight color="blue">{content}</CircleHighlight>,
          highlight: (content) => <TextHighlight>{content}</TextHighlight>,
        }}
      />
      <Examples
        examples={examples.attribute}
        title={
          <Translate
            en="Attribute Examples"
            pt="Exemplos de Atributos"
          />
        }
      />
      <br />

      <Translate
        en="The <area>yellow area</area> has a rule related to the <highlight>word</highlight>: the name of the thing, spelling, grammar or pronunciation."
        pt="A <area>área amarela</area> tem uma regra relacionada à <highlight>palavra</highlight>: o nome da coisa, ortografia, gramática ou pronúncia."
        values={{
          area: (content) => <CircleHighlight color="yellow">{content}</CircleHighlight>,
          highlight: (content) => <TextHighlight>{content}</TextHighlight>,
        }}
      />
      <Examples
        examples={examples.word}
        title={
          <Translate
            en="Word Examples"
            pt="Exemplos de Palavras"
          />
        }
      />

      {hasContext && (
        <>
          <br />
          <Translate
            en="The <area>red area</area> has a rule related to the <highlight>context</highlight> of the thing, where you might find it or use it."
            pt="A <area>área vermelha</area> tem uma regra relacionada ao <highlight>contexto</highlight> da coisa, onde você pode encontrá-la ou usá-la."
            values={{
              area: (content) => <CircleHighlight color="red">{content}</CircleHighlight>,
              highlight: (content) => <TextHighlight>{content}</TextHighlight>,
            }}
          />
          <Examples
            examples={examples.context ?? []}
            title={
              <Translate
                en="Context Examples"
                pt="Exemplos de Contexto"
              />
            }
          />
        </>
      )}
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
