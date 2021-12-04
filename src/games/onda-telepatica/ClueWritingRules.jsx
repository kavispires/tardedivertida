import { CollapsibleRule } from '../../components/rules';
import { useLanguage } from '../../hooks';

function RulesPt() {
  return (
    <ul>
      <li>
        Use uma única idea. Evite usar "mas", "enquanto", "quando", e também superlativos "super", "muito"
      </li>
      <li>Não invente coisas. Exemplo: 'Nicolas Cage cantando uma música dos Beatles' é inválido.</li>
      <li>Mantenha-se no assunto da carta. Exemplo: 'Amor' não é uma dica válida para 'Sujo'.</li>
      <li>Não use números para sugerir a posição do ponteiro.</li>
      <li>Não use partes, derivados ou sinônimos das palavras da carta.</li>
    </ul>
  );
}

function RulesEn() {
  return (
    <ul>
      <li>
        Use a single idea. Avoid the use of "but", "while", "when", and superlatives like "super", "very",
        etc.
      </li>
      <li>Do not make up things. Example: 'Nicolas Cage singing the Beatles' is invalid.</li>
      <li>Keep it within the theme. Example: 'Love' is not a valid clue for 'Dirty'.</li>
      <li>Don't use number to suggest the position of the needle.</li>
      <li>Don't use parts or synonyms of the words in the cards.</li>
    </ul>
  );
}

function ClueWritingRules() {
  const language = useLanguage();
  return <CollapsibleRule>{language === 'pt' ? <RulesPt /> : <RulesEn />}</CollapsibleRule>;
}

export default ClueWritingRules;
