import type { ReactNode } from 'react';
// Icons
import { NewFeatureIcon } from 'icons/NewFeatureIcon';
import { WeekendIcon } from 'icons/WeekendIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate } from 'components/language';
// Internal
import { ALL_SETTINGS } from '../utils/settings';

type NewsItem = {
  date: string; // YYYY-MM-DD format
  content: ReactNode;
};

export const NEWS_LIST: NewsItem[] = [
  {
    date: '2025-06-14',
    content: (
      <>
        <IconAvatar icon={<WeekendIcon />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.FILMACO.NAME}</DualTranslate>
        </strong>{' '}
        é mais desafiante nos fins de semana com dois filmes ao mesmo tempo! Sessão dupla!
      </>
    ),
  },
  {
    date: '2025-06-07',
    content: (
      <>
        <em>Novo jogo adicionado:</em>
        <br />
        <IconAvatar icon={<ALL_SETTINGS.ORGANIKU.HUB_ICON />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.ORGANIKU.HUB_NAME}</DualTranslate>
        </strong>{' '}
        - descubra onde cada item pertence! Uai, é tipo Sudoku?
      </>
    ),
  },
  {
    date: '2025-05-16',
    content: (
      <>
        <IconAvatar icon={<WeekendIcon />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.TEORIA_DE_CONJUNTOS.NAME}</DualTranslate>
        </strong>{' '}
        é mais desafiante nos fins de semana com 5 items a serem posicionados!
      </>
    ),
  },
  {
    date: '2025-04-17',
    content: (
      <>
        <IconAvatar icon={<NewFeatureIcon />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.COMUNICACAO_ALIENIGENA.NAME}</DualTranslate>
        </strong>{' '}
        agora tem dicas do que os símbolos representam!
      </>
    ),
  },
  {
    date: '2025-04-12',
    content: (
      <>
        <em>Novo jogo adicionado:</em>
        <br />
        <IconAvatar icon={<ALL_SETTINGS.PORTAIS_MAGICOS.HUB_ICON />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.PORTAIS_MAGICOS.NAME}</DualTranslate>
        </strong>{' '}
        - abra as portas resolvendo as palavras chaves!
      </>
    ),
  },
  {
    date: '2025-03-01',
    content: (
      <>
        <em>Novo jogo adicionado:</em>
        <br />
        <IconAvatar icon={<ALL_SETTINGS.QUARTETOS.HUB_ICON />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.QUARTETOS.HUB_NAME}</DualTranslate>
        </strong>{' '}
        - faça quatro grupos de quatro!
      </>
    ),
  },
  {
    date: '2025-02-22',
    content: (
      <>
        <em>Nova forma de contribuir:</em>
        <br />
        <IconAvatar icon={<ALL_SETTINGS.TA_NA_CARA.HUB_ICON />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.TA_NA_CARA.HUB_NAME}</DualTranslate>
        </strong>{' '}
        - julgue as pessoas pela cara!
      </>
    ),
  },
  {
    date: '2025-02-09',
    content: (
      <>
        <IconAvatar icon={<NewFeatureIcon />} size="small" /> Agora todos os jogos tem efeitos sonoros para
        uma melhor experiência!
      </>
    ),
  },
  {
    date: '2025-01-10',
    content: (
      <>
        <IconAvatar icon={<WeekendIcon />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.AQUI_O.NAME}</DualTranslate>
        </strong>{' '}
        é mais desafiante nos fins de semana com 9 itens aleatórios por disco!
      </>
    ),
  },
  {
    date: '2024-11-09',
    content: (
      <>
        <em>Novo jogo adicionado:</em>
        <br />
        <IconAvatar icon={<ALL_SETTINGS.COMUNICACAO_ALIENIGENA.HUB_ICON />} size="small" />{' '}
        <strong>
          <DualTranslate>{ALL_SETTINGS.COMUNICACAO_ALIENIGENA.NAME}</DualTranslate>
        </strong>{' '}
        - desvende a linguagem alienígena e salve o planeta!
      </>
    ),
  },
];
