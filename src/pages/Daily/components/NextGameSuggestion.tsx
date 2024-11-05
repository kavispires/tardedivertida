import { Link } from 'react-router-dom';
// Ant Design Resources
import { Typography } from 'antd';
// Icons
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { DailyFindingGameIcon } from 'icons/DailyFindingGameIcon';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { DailyWarehouseGameIcon } from 'icons/DailyWarehouseGameIcon';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
// Internal
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as ARTISTA } from '../games/Picaco/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { checkWasPlayedToday } from '../utils';

const PRIORITY_LIST = [
  TEORIA_DE_CONJUNTOS,
  ARTE_RUIM,
  FILMACO,
  PALAVREADO,
  AQUI_O,
  CONTROLE_DE_ESTOQUE,
  ARTISTA,
];

const getNextGame = (): string => {
  for (const game of PRIORITY_LIST) {
    if (!checkWasPlayedToday(game.KEY)) {
      return game.KEY;
    }
  }
  return '';
};

export function NextGameSuggestion() {
  switch (getNextGame()) {
    case AQUI_O.KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Já encontrou a coisa em comum? Ela está..."
            en="Have you found the matching thing?"
          />
          <br />

          <Link to="/diario/aqui-o">
            <IconAvatar icon={<DailyFindingGameIcon />} /> <DualTranslate>{AQUI_O.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case ARTE_RUIM.KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate pt="Adivinhe o título das obras de arte!" en="Guess the title of the artworks!" />
          <br />
          <Link to="/diario/arte-ruim">
            <IconAvatar icon={<DailyArtGameIcon />} /> <DualTranslate>{ARTE_RUIM.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case CONTROLE_DE_ESTOQUE.KEY:
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

    case FILMACO.KEY:
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

    case PALAVREADO.KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="E se o caça palavras estivesse todo embaralhado?"
            en="What if the word search was all scrambled?"
          />
          <br />

          <Link to="/diario/palavreado">
            <IconAvatar icon={<DailyWordGameIcon />} /> <DualTranslate>{PALAVREADO.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case ARTISTA.KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate
            pt="Já desenhou hoje? Novas frases todos os dias!"
            en="Already drawn today? New phrases every day!"
          />
          <br />
          <Link to="/diario/picaco">
            <IconAvatar icon={<DailyDrawingGameIcon />} /> <DualTranslate>{ARTISTA.NAME}</DualTranslate>!
          </Link>
        </Typography.Paragraph>
      );

    case TEORIA_DE_CONJUNTOS.KEY:
      return (
        <Typography.Paragraph className="center" strong>
          <Translate pt="Quantas vogais têm em PQP?" en="Can you solve this set challenge?" />
          <br />
          <Link to="/diario/teoria-de-conjuntos">
            <IconAvatar icon={<DailyDiagramGameIcon />} />{' '}
            <DualTranslate>{TEORIA_DE_CONJUNTOS.NAME}</DualTranslate>!
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
