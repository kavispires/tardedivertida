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
import { SETTINGS } from '../utils/settings';
import { checkWasPlayedToday } from '../utils';

const PRIORITY_LIST = [
  SETTINGS.QUARTETOS,
  SETTINGS.ARTE_RUIM,
  ...shuffle([
    SETTINGS.COMUNICACAO_ALIENIGENA,
    SETTINGS.TEORIA_DE_CONJUNTOS,
    SETTINGS.FILMACO,
    SETTINGS.PALAVREADO,
  ]),
  ...shuffle([SETTINGS.AQUI_O, SETTINGS.CONTROLE_DE_ESTOQUE]),
  SETTINGS.TA_NA_CARA,
  SETTINGS.PICACO,
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
