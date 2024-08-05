import { Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Link } from 'react-router-dom';

import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Artista/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { getToday } from '../utils';
import { DualTranslate, Translate } from 'components/language';

const PRIORITY_LIST = [ARTE_RUIM, CONTROLE_DE_ESTOQUE, FILMACO, PALAVREADO, AQUI_O, ARTISTA];

const checkIsPlayedToday = (key: string): boolean => {
  const session = JSON.parse(localStorage.getItem(key) || '{}');
  const today = getToday();
  return session?.id === today;
};

const getNextGame = (): string => {
  for (const game of PRIORITY_LIST) {
    if (!checkIsPlayedToday(game.LOCAL_TODAY_KEY)) {
      return game.LOCAL_TODAY_KEY;
    }
  }
  return '';
};

export function NextGameSuggestion() {
  switch (getNextGame()) {
    case AQUI_O.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Já encontrou o que está faltando? Ele está..."
            en="Already found what's missing? It's..."
          />
          <br />

          <Link to="/diario/aqui-i">
            <IconAvatar icon={<DailyFindingGameIcon />} /> <DualTranslate>{AQUI_O.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case ARTE_RUIM.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate pt="Adivinhe o título das obras de arte!" en="Guess the title of the artworks!" />
          <br />
          <Link to="/diario/arte-ruim">
            <IconAvatar icon={<DailyArtGameIcon />} /> <DualTranslate>{ARTE_RUIM.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case CONTROLE_DE_ESTOQUE.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Venha aplicar um feng-shui nessa prateleira!"
            en="Come apply some feng-shui to this shelf!"
          />
          <br />
          <Link to="/diario/controle-de-estoque">
            <IconAvatar icon={<DailyWarehouseGameIcon />} />{' '}
            <DualTranslate>{CONTROLE_DE_ESTOQUE.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case FILMACO.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Pegue a pipoca e venha descobrir esse filme!"
            en="Get the popcorn and come find out about this movie!"
          />
          <br />
          <Link to="/diario/filmaco">
            <IconAvatar icon={<DailyMovieGameIcon />} /> <DualTranslate>{FILMACO.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case PALAVREADO.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="E se o casa palavras estivesse todo embaralhado?"
            en="What if the word search was all scrambled?"
          />
          <br />

          <Link to="/diario/palavreado">
            <IconAvatar icon={<DailyWordGameIcon />} /> <DualTranslate>{PALAVREADO.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case ARTISTA.LOCAL_TODAY_KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Já desenhou hoje? Novas frases todos os dias!"
            en="Already drawn today? New phrases every day!"
          />
          <br />
          <Link to="/diario/artista">
            <IconAvatar icon={<DailyDrawingGameIcon />} /> <DualTranslate>{ARTISTA.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    default:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate pt="Você já jogou todos os jogos de hoje!" en="You've played all today's games!" />
          <br />
          <Translate pt="Que eficiência!" en="How efficient!" />
        </Typography.Paragraph>
      );
  }
}
