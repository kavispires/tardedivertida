import type { ReactNode } from 'react';
// Icons
import { AudioIcon } from 'icons/AudioIcon';
import { IncreaseDifficultyIcon } from 'icons/IncreaseDifficultyIcon';
import { PrototypeIcon } from 'icons/PrototypeIcon';
import { RulesIcon } from 'icons/RulesIcon';
import { WeekendIcon } from 'icons/WeekendIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
// Internal
import { ALL_SETTINGS } from '../utils/settings';
import type { GameSettings } from '../utils/types';

type NewsItem = {
  date: string; // YYYY-MM-DD format
  content: ReactNode;
  exact?: boolean;
};

export const NEWS_LIST: NewsItem[] = [
  {
    date: '2026-06-20',
    content: (
      <GameFeatureEntry
        type="rules"
        game={ALL_SETTINGS.PALAVREADO}
        description="agora dá pontos por letras corretas e palavras corretas. E ainda mais, se você formar uma das palavras secretas, você também ganha pontos!"
      />
    ),
  },
  {
    date: '2026-06-07',
    content: (
      <GameFeatureEntry
        type="rules"
        game={ALL_SETTINGS.PIRRALHOS}
        description="as regras foram atualizadas! O pirralho culpado nem sempre mente e nem sempre o número de mentirosos é correto (pode ser exato ou um a menos)."
      />
    ),
  },
  {
    date: '2026-06-06',
    content: (
      <EngineImprovementEntry
        description={
          <>
            Agora você pode arrastar os quadradinhos com letras em{' '}
            <strong>
              <DualTranslate>{ALL_SETTINGS.PALAVREADO.NAME}</DualTranslate>
            </strong>{' '}
            e também os objetos que você entrega ao alienígena em{' '}
            <strong>
              <DualTranslate>{ALL_SETTINGS.AQUI_O.NAME}</DualTranslate>
            </strong>{' '}
            para organizá-los como preferir!
          </>
        }
      />
    ),
  },
  {
    date: '2026-05-26',
    content: (
      <GameFeatureEntry
        type="rules"
        game={ALL_SETTINGS.INVESTIGACAO}
        description="agora tem 3 vidas e elas podem ser usadas para dar dicas que eliminam colunas e linhas de suspeitos."
      />
    ),
  },
  {
    date: '2026-05-24',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.PIRRALHOS}
        tagline="qual criança pegou o brinquedo?"
      />
    ),
  },
  {
    date: '2026-05-17',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.MAPEAMENTO}
        tagline="adivinhe o lugar com base nas pistas datas pela IA!"
      />
    ),
  },
  {
    date: '2026-05-03',
    content: (
      <EngineImprovementEntry
        description={
          <>
            Vários jogos agora estão com nomes atualizados para refletir melhor a experiência do jogo:{' '}
            <span>
              <strong>
                <DualTranslate>{ALL_SETTINGS.INVESTIGACAO.NAME}</DualTranslate>,
              </strong>{' '}
              <strong>
                <DualTranslate>{ALL_SETTINGS.ALIENADO.NAME}</DualTranslate>
              </strong>
              ,{' '}
              <strong>
                <DualTranslate>{ALL_SETTINGS.VITRAL.NAME}</DualTranslate>
              </strong>
              , e{' '}
              <strong>
                <DualTranslate>{ALL_SETTINGS.ESTOQUISTA.NAME}</DualTranslate>
              </strong>
              !
            </span>
          </>
        }
      />
    ),
  },
  {
    date: '2026-04-05',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.PALAVREADO}
        description={
          <>
            agora tem um botão de Embaralhar Inteligente (💡) que reorganiza as letras incorretas respeitando
            vogais e consoantes!
          </>
        }
      />
    ),
  },
  {
    date: '2026-04-04',
    content: (
      <NewGameEntry
        type="contribution"
        game={ALL_SETTINGS.CONEXOES}
        tagline="avalie se pares de imagens estão relacionados!"
      />
    ),
  },
  {
    date: '2026-02-14',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.INVESTIGACAO}
        description="é mais desafiante nos fins de semana com 16 suspeitos para investigar!"
      />
    ),
  },
  {
    date: '2026-02-09',
    content: (
      <>
        <em>Nova sessão de jogos especiais:</em>
        <br />
        Jogue quantas vezes quiser o jogo{' '}
        <IconAvatar
          icon={<ALL_SETTINGS.ENDLESS_VITRAIS.HUB_ICON />}
          size="small"
        />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.ENDLESS_VITRAIS.NAME}</DualTranslate>
        </strong>{' '}
        com uma imagem diferente a cada partida!
      </>
    ),
  },
  {
    date: '2026-01-09',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.AQUI_O}
        description={
          <>
            está mais interessante se você ativar o modo <strong>Com Voz</strong> no jogo e toda vez que você
            acertar um item, ele será anunciado em voz alta!
          </>
        }
      />
    ),
  },
  {
    date: '2025-12-24',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.VITRAL}
        tagline="desvende a imagem neste quebra-cabeça!"
      />
    ),
  },
  {
    date: '2025-11-01',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.ORGANIKU}
        description={
          <>
            agora facilita identificar os items que estão faltando para completar o disco, mostrando a
            contagem de quantos estão faltando e colorindo de amarelo quando você completar todos os itens de
            um tipo!
          </>
        }
      />
    ),
  },
  {
    date: '2025-09-29',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.CONJUNTOS}
        description={
          <>
            agora deixa você clicar e segurar um ícone e te mostrará quantas letras, vogais e consoantes tem o
            nome do item! Que prático!
          </>
        }
      />
    ),
  },
  {
    date: '2025-09-20',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.ORGANIKU}
        description="é mais desafiante nos fins de semana com 6 tipos de itens!"
      />
    ),
  },
  {
    date: '2025-08-09',
    content: (
      <EngineImprovementEntry
        description={
          <>
            <strong>Em jogos com ícones</strong>, ao clicar e segurar um ícone, aparecerá um nome como
            sugestão para ajudar a identificá-lo. Esse nome pode não ser o mesmo usado pelo jogo em si. Por
            exemplo, o nome “fatia de bolo” pode estar sendo usado como “torta” ou apenas “bolo” em alguns
            jogos, mas a sugestão vai aparecer como "fatia de bolo".
          </>
        }
      />
    ),
  },
  {
    date: '2025-07-05',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.INVESTIGACAO}
        tagline="descubra quem é o culpado entre os suspeitos!"
      />
    ),
  },
  {
    date: '2025-06-28',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.TA_NA_CARA}
        description="agora você pode mudar o estilo dos suspeitos!"
      />
    ),
  },
  {
    date: '2025-06-14',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.FILMACO}
        description="é mais desafiante nos fins de semana com dois filmes ao mesmo tempo! Sessão dupla!"
      />
    ),
  },
  {
    date: '2025-06-07',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.QUARTETOS}
        tagline="ache pares de objetos em cada linha e coluna. Uai, é tipo Sudoku?"
      />
    ),
  },
  {
    date: '2025-05-16',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.CONJUNTOS}
        description="é mais desafiante nos fins de semana com 5 items iniciais a serem posicionados!"
      />
    ),
  },
  {
    date: '2025-04-17',
    content: (
      <GameFeatureEntry
        type="improvement"
        game={ALL_SETTINGS.ALIENADO}
        description="agora tem dicas do que os símbolos representam!"
      />
    ),
  },
  {
    date: '2025-04-12',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.PORTAIS}
        tagline="abra as portas resolvendo as palavras chaves!"
      />
    ),
  },
  {
    date: '2025-03-01',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.QUARTETOS}
        tagline="analise os objetos e faça grupos de quatro!"
      />
    ),
  },
  {
    date: '2025-02-22',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.TA_NA_CARA}
        tagline="julgue as pessoas pela cara!"
        type="contribution"
      />
    ),
  },
  {
    date: '2025-02-09',
    content: (
      <EngineImprovementEntry
        icon={<AudioIcon />}
        description="Agora todos os jogos tem efeitos sonoros para uma melhor experiência!"
      />
    ),
  },
  {
    date: '2025-01-10',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.AQUI_O}
        description="é mais desafiante nos fins de semana com 9 itens aleatórios por disco!"
      />
    ),
  },
  {
    date: '2024-11-09',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.ALIENADO}
        tagline="desvende a linguagem alienígena e salve o planeta!"
      />
    ),
  },
  {
    date: '2024-08-31',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.CONJUNTOS}
        tagline="teste sua gramática e lógica com teoria de conjuntos!"
      />
    ),
  },
  {
    date: '2024-08-17',
    content: (
      <GameFeatureEntry
        type="weekend"
        game={ALL_SETTINGS.PALAVREADO}
        description="é mais desafiante nos fins de semana com palavras de 5 letras!"
      />
    ),
  },
  {
    date: '2024-08-04',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.ESTOQUISTA}
        tagline="organize os itens no estoque do mercadinho!"
      />
    ),
  },
  {
    date: '2024-05-30',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.FILMACO}
        tagline="adivinhe o filme pelas cenas embaralhadas!"
      />
    ),
  },
  {
    date: '2024-05-10',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.PALAVREADO}
        tagline="monte as palavras com as letras embaralhadas!"
      />
    ),
  },
  {
    date: '2024-04-30',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.PICACO}
        tagline="desenhe e contribua com seu dom artístico!"
        type="contribution"
      />
    ),
  },
  {
    date: '2024-04-30',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.AQUI_O}
        tagline="encontre os itens em comum entre os discos!"
      />
    ),
  },
  {
    date: '2023-11-04',
    content: (
      <NewGameEntry
        game={ALL_SETTINGS.ARTE_RUIM}
        tagline="adivinhe o título das obras de arte!"
      />
    ),
  },
];

type GameNameProps = {
  game: GameSettings;
};

function GameName({ game }: GameNameProps) {
  return (
    <strong>
      <DualTranslate>{game.NAME}</DualTranslate>
    </strong>
  );
}

type NewGameEntryProps = {
  game: GameSettings;
  tagline: string;
  type?: 'game' | 'contribution';
};

function NewGameEntry({ game, tagline, type = 'game' }: NewGameEntryProps) {
  return (
    <>
      <em>
        {type === 'game' && 'Novo jogo adicionado:'}
        {type === 'contribution' && 'Nova forma de contribuir:'}
      </em>
      <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'min-content 1fr' }}>
        <IconAvatar
          icon={<game.HUB_ICON />}
          size="small"
        />
        <span>
          <GameName game={game} /> - {tagline}
        </span>
      </div>
    </>
  );
}

type GameFeatureEntryProps = {
  type: 'weekend' | 'improvement' | 'rules';
  game?: GameSettings; // Only needed for weekend features
  description: ReactNode;
};

function GameFeatureEntry({ type, description, game }: GameFeatureEntryProps) {
  return (
    <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'min-content 1fr' }}>
      <IconAvatar
        icon={
          <>
            {type === 'weekend' && <WeekendIcon />}
            {type === 'improvement' && <IncreaseDifficultyIcon />}
            {type === 'rules' && <RulesIcon />}
          </>
        }
        size="small"
      />
      <span>
        {!!game && (
          <>
            {' '}
            <GameName game={game} /> -{' '}
          </>
        )}
        {description}
      </span>
    </div>
  );
}

type EngineImprovementEntryProps = {
  icon?: ReactNode;
  description: ReactNode;
};

function EngineImprovementEntry({ icon, description }: EngineImprovementEntryProps) {
  return (
    <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'min-content 1fr' }}>
      <IconAvatar
        icon={icon ?? <PrototypeIcon />}
        size="small"
      />
      <span>{description}</span>
    </div>
  );
}
