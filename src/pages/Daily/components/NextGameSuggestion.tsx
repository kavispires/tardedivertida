import { shuffle } from 'lodash';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
// Ant Design Resources
import { Carousel, Typography } from 'antd';
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
import { SETTINGS as TA_NA_CARA } from '../games/TaNaCara/utils/settings';
import { checkWasPlayedToday } from '../utils';

const PRIORITY_LIST = [
  ARTE_RUIM,
  ...shuffle([COMUNICACAO_ALIENIGENA, TEORIA_DE_CONJUNTOS, FILMACO, PALAVREADO]),
  AQUI_O,
  CONTROLE_DE_ESTOQUE,
  TA_NA_CARA,
  PICACO,
];

const getUnplayedGames = () => {
  return PRIORITY_LIST.filter((game) => !checkWasPlayedToday(game.KEY)).map((settings) =>
    NextSuggestionEntry({ settings }),
  );
};

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

export const NextGameSuggestion = () => {
  const unplayedGames = useMemo(() => {
    return getUnplayedGames();
  }, []);

  if (unplayedGames.length === 0) {
    return (
      <Typography.Paragraph className="center" strong>
        <Translate pt="Você já jogou todos os jogos de hoje!" en="You've played all today's games!" />
        <br />
        <Translate pt="Que eficiência!" en="How efficient!" />
      </Typography.Paragraph>
    );
  }

  return (
    <div style={{ width: '84vw', maxWidth: 500 }}>
      <Carousel autoplay autoplaySpeed={6000} dots={false}>
        {unplayedGames.map((entry, index) => (
          <div key={index}>{entry}</div>
        ))}
      </Carousel>
    </div>
  );
};
