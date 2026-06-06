import { parse, isValid, differenceInDays } from 'date-fns';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Carousel, Typography } from 'antd';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Internal
import type { GameSettings } from '../utils/types';
import { ALL_SETTINGS } from '../utils/settings';
import { checkWasPlayedToday, daysSinceRelease, getAnalyticsEventName } from '../utils';
import { useDailyChallengeContext } from '../hooks/useDailyChallengeContext';

const PRIORITY_LIST = orderBy(
  Object.values(ALL_SETTINGS).filter(
    (settings) => settings.TYPE === 'game' && daysSinceRelease(settings.RELEASE_DATE) > 0,
  ),
  [
    (o) => {
      const releaseDate = parse(o.RELEASE_DATE, 'yyyy-MM-dd', new Date());
      const now = new Date();
      const daysUntilRelease = differenceInDays(releaseDate, now);
      return isValid(releaseDate) && daysUntilRelease <= 30 && daysUntilRelease >= 0;
    },
    'TYPE',
    'NAME',
  ],
  ['desc', 'desc', 'asc'],
);

const getUnplayedGames = () => {
  return PRIORITY_LIST.filter((game) => !checkWasPlayedToday(game.KEY)).map((settings) =>
    NextSuggestionEntry({ settings }),
  );
};

type NextSuggestionEntryProps = {
  settings: GameSettings;
};

function NextSuggestionEntry({ settings }: NextSuggestionEntryProps) {
  const { setActiveGame } = useDailyChallengeContext();

  const handleClick = () => {
    logAnalyticsEvent(getAnalyticsEventName(settings.KEY, 'game_suggestion'));
    setActiveGame(settings.ROUTE);
  };

  return (
    <Typography.Paragraph
      className="center"
      strong
      key={settings.KEY}
    >
      <DualTranslate>{settings.TAGLINE}</DualTranslate>
      <br />
      <button
        type="button"
        onClick={handleClick}
        className="daily-next-game-suggestion-button"
      >
        <IconAvatar icon={<settings.HUB_ICON />} /> <DualTranslate>{settings.NAME}</DualTranslate>!
      </button>
    </Typography.Paragraph>
  );
}

export const NextGameSuggestion = () => {
  const unplayedGames = useMemo(() => {
    return getUnplayedGames();
  }, []);

  if (unplayedGames.length === 0) {
    return (
      <Typography.Paragraph
        className="center"
        strong
      >
        <Translate
          pt="Você já jogou todos os jogos de hoje!"
          en="You've played all today's games!"
        />
        <br />
        <Translate
          pt="Que eficiência!"
          en="How efficient!"
        />
      </Typography.Paragraph>
    );
  }

  return (
    <div style={{ width: '84vw', maxWidth: 500 }}>
      <Carousel
        autoplay
        autoplaySpeed={5000}
        dots={false}
      >
        {unplayedGames.map((entry) => (
          <div key={entry.key}>{entry}</div>
        ))}
      </Carousel>
    </div>
  );
};
