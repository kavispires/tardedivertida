import { orderBy } from 'lodash';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
// Ant Design Resources
import { Carousel, Typography } from 'antd';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Components
import { IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { GameSettings } from '../utils/types';
import { ALL_SETTINGS } from '../utils/settings';
import { checkWasPlayedToday } from '../utils';

const PRIORITY_LIST = orderBy(
  [
    ALL_SETTINGS.AQUI_O,
    ALL_SETTINGS.ARTE_RUIM,
    ALL_SETTINGS.COMUNICACAO_ALIENIGENA,
    ALL_SETTINGS.TEORIA_DE_CONJUNTOS,
    ALL_SETTINGS.FILMACO,
    ALL_SETTINGS.PALAVREADO,
    ALL_SETTINGS.CONTROLE_DE_ESTOQUE,
    ALL_SETTINGS.ORGANIKU,
    ALL_SETTINGS.TA_NA_CARA,
    ALL_SETTINGS.PICACO,
    ALL_SETTINGS.PORTAIS_MAGICOS,
    ALL_SETTINGS.QUARTETOS,
  ],
  ['name.pt'],
  ['asc'],
);

const getUnplayedGames = () => {
  return PRIORITY_LIST.filter((game) => !checkWasPlayedToday(game.KEY)).map((settings) =>
    NextSuggestionEntry({ settings }),
  );
};

function NextSuggestionEntry({ settings }: { settings: GameSettings }) {
  return (
    <Typography.Paragraph className="center" strong key={settings.KEY}>
      <DualTranslate>{settings.TAGLINE}</DualTranslate>
      <br />
      <Link
        to={`/diario/${settings.ROUTE}`}
        onClick={() => logAnalyticsEvent(`daily_${settings.KEY}_game_suggestion`)}
      >
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
      <Carousel autoplay autoplaySpeed={5000} dots={false}>
        {unplayedGames.map((entry) => (
          <div key={entry.key}>{entry}</div>
        ))}
      </Carousel>
    </div>
  );
};
