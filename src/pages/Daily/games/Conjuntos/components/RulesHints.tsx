// Components
import { Translate } from '@components/language/Translate';
// Pages
import { RuleEntry, RulesHintsModal } from '@pages/Daily/components/RulesHintsModal';

export function RulesHints() {
  return (
    <RulesHintsModal
      label={
        <Translate
          pt="Entenda as regras gramaticais"
          en="Understand the grammar rules"
        />
      }
      title={
        <Translate
          pt="Regras gramaticais"
          en="Grammar rules"
        />
      }
      description={
        <Translate
          pt="O título do jogo diário contém dicas sobres as regras gramaticais secretas dos círculos em forma de
          categorias.
          <br/>
          As estrelas é a classificação do nível de dificuldade das regras (1-5)."
          en="The title of the daily game contains hints about the secret grammar rules of the circles in the form of
          categories.
          <br/>
          The stars are the classification of the level of difficulty of the rules (1-5)."
        />
      }
    >
      <RuleEntry
        category="Comparação"
        hints={['Quantidade de vogais vs consoantes ou posição']}
      />

      <RuleEntry
        category="Contagem"
        hints={['Contém um número específico de letras, vogais, consoantes, ou sílabas']}
      />

      <RuleEntry
        category="Gramática"
        hints={['Sílaba tônica, origem, gênero']}
      />

      <RuleEntry
        category="Inclusão"
        hints={['Contém uma ou mais letras específicas']}
      />

      <RuleEntry
        category="Inicialização"
        hints={['Começa com uma letra (ou letras) específica']}
      />

      <RuleEntry
        category="Repetição"
        hints={['Contém letras repetidas ou repetidas de maneira específica']}
      />

      <RuleEntry
        category="Sequência"
        hints={['Contém uma sequência de letras específica']}
      />

      <RuleEntry
        category="Terminação"
        hints={['Termina com uma letra (ou letras) específica']}
      />
    </RulesHintsModal>
  );
}
