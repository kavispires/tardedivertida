import { shuffle } from 'lodash';
import { Link } from 'react-router-dom';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { GameSettings } from '../utils/types';
import { SETTINGS as AQUI_O } from '../games/AquiO/utils/settings';
import { SETTINGS as ARTE_RUIM } from '../games/ArteRuim/utils/settings';
import { SETTINGS as COMUNICACAO_ALIENIGENA } from '../games/ComunicacaoAlienigena/utils/settings';
import { SETTINGS as CONTROLE_DE_ESTOQUE } from '../games/ControleDeEstoque/utils/settings';
import { SETTINGS as FILMACO } from '../games/Filmaco/utils/settings';
import { SETTINGS as PALAVREADO } from '../games/Palavreado/utils/settings';
import { SETTINGS as PICACO } from '../games/Picaco/utils/settings';
import { SETTINGS as TEORIA_DE_CONJUNTOS } from '../games/TeoriaDeConjuntos/utils/settings';
import { checkWasPlayedToday } from '../utils';

const PRIORITY_LIST = [
  ARTE_RUIM,
  ...shuffle([COMUNICACAO_ALIENIGENA, TEORIA_DE_CONJUNTOS, FILMACO, PALAVREADO]),
  AQUI_O,
  CONTROLE_DE_ESTOQUE,
  PICACO,
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
      return NextSuggestionEntry({ settings: AQUI_O });

    case ARTE_RUIM.KEY:
      return NextSuggestionEntry({ settings: ARTE_RUIM });

    case COMUNICACAO_ALIENIGENA.KEY:
      return NextSuggestionEntry({ settings: COMUNICACAO_ALIENIGENA });

    case CONTROLE_DE_ESTOQUE.KEY:
      return NextSuggestionEntry({ settings: CONTROLE_DE_ESTOQUE });

    case FILMACO.KEY:
      return NextSuggestionEntry({ settings: FILMACO });

    case PALAVREADO.KEY:
      return NextSuggestionEntry({ settings: PALAVREADO });

    case PICACO.KEY:
      return NextSuggestionEntry({ settings: PICACO });

    case TEORIA_DE_CONJUNTOS.KEY:
      return NextSuggestionEntry({ settings: TEORIA_DE_CONJUNTOS });

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

function NextSuggestionEntry({ settings }: { settings: GameSettings }) {
  return (
    <Typography.Paragraph className="center" strong>
      <DualTranslate>{settings.TAGLINE}</DualTranslate>
      <br />
      <Link to={`/diario/${settings.ROUTE}`}>
        <IconAvatar icon={<settings.HUB_ICON />} /> <DualTranslate>{settings.NAME}</DualTranslate>!
      </Link>
    </Typography.Paragraph>
  );
}
