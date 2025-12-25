// Components
import { Translate } from 'components/language';
// Pages
import { RuleEntry, RulesHintsModal } from 'pages/Daily/components/RulesHintsModal';

export function RulesHints() {
  return (
    <RulesHintsModal
      label={<Translate pt="Entenda como o alienígena pensa" en="Understand how the alien thinks" />}
      title={<Translate pt="Regras dos atributos" en="Attributes rules" />}
      description={
        <>
          O alienígena pensa em conceitos gerais e agrupa coisas comuns em atributos abrangentes.
          <br />
          Por exemplo, líquido e aquático serão classificados como "líquido", enquanto "instrumento" e
          "utensílio" serão classificados como "instrumentos".
        </>
      }
    >
      <RuleEntry
        category="Fáceis"
        hints={[
          'Afiado',
          'Arma',
          'Brinquedo',
          'Comida',
          'Frio',
          'Vestimenta',
          'Planta',
          'Quente',
          'Vôo',
          'Transporte',
        ]}
      />

      <RuleEntry
        category="Médios"
        hints={[
          'Brilho/Luz',
          'Construção',
          'Escrita',
          'Humano',
          'Vivo',
          'Líquido',
          'Local',
          'Madeira',
          'Máquina',
          'Metal',
          'Novo/Jovem',
          'Plástico',
          'Recipiente',
          'Redondo',
          'Tecnologia',
        ]}
      />

      <RuleEntry
        category="Difíceis"
        hints={[
          'Altura',
          'Cultura',
          'Grande',
          'Longo',
          'Mítico/Espiritual',
          'Natural',
          'Perigo',
          'Pesado',
          'Plano',
          'Tabu/Polêmico',
          'Valioso',
          'Velho/Obsoleto',
        ]}
      />

      <RuleEntry
        category="Confusos"
        hints={[
          'Acessórios',
          'Bonito',
          'Conhecimento',
          'Defesa/Proteção',
          'Força',
          'Macio',
          'Parte/Pedaço',
          'Pequeno',
          'Rápido',
          'Som',
        ]}
      />

      <RuleEntry
        category="Entregue a Deus"
        hints={[
          'Botões',
          'Cheiro/Fedor',
          'Duro',
          'Ferramenta',
          'Frágil',
          'Instrumento/Utensílio',
          'Segurável/Alças',
        ]}
      />
    </RulesHintsModal>
  );
}
