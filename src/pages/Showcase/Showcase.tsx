import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEffectOnce, useTitle, useWindowSize } from 'react-use';
// Ant Design Resources
import { Avatar, Image, Layout, Modal, Space } from 'antd';
import { FilterFilled } from '@ant-design/icons';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import GAMES from 'utils/info';
import { PUBLIC_URL } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
import { filterGames } from './helpers';
// Components
import { FiltersDrawer } from './components/FilterDrawers';
import { GameDetailsContent } from './components/GameDetailsContent';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';

const GAME_LIST: GameInfo[] = Object.values(GAMES);

function Showcase() {
  useTitle('Showcase | Tarde Divertida');
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { width } = useWindowSize();
  const [, setLanguage] = useGlobalState('language');

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState('');
  const [filters, setFilters] = useState<PlainObject>({ availability: 'on' });

  const [list, setList] = useState<GameInfo[]>([]);

  // Load query params
  useEffectOnce(() => {
    const searchAsObject = Object.fromEntries(new URLSearchParams(searchParams));
    if (Object.keys(searchAsObject).length > 0) {
      const parsedQP = Object.entries(searchAsObject).reduce((acc: StringDictionary, [key, value]) => {
        if (value === 'off' || value === 'on') {
          acc[key] = value;
        }
        if (key === 'language' && value === 'en') {
          setLanguage('en');
        }
        if (value !== 'any') {
          acc[key] = value;
        }

        return acc;
      }, {});

      setFilters(parsedQP);
    }
  });

  useEffect(() => {
    setList(filterGames(GAME_LIST, filters));
    const queryString = Object.keys(filters)
      .filter((key) => filters[key] !== 'any')
      .map((key) => `${key}=${filters[key]}`);

    if (language !== 'pt') {
      queryString.push(`language=${language}`);
    }
    setSearchParams(queryString.join('&'));
  }, [filters, language, setSearchParams, setLanguage]);

  return (
    <Layout.Content className="showcase">
      <ul className="showcase-list" style={{ gridTemplateColumns: `repeat(${width > 450 ? 4 : 2}, 1fr)` }}>
        <li className={clsx('showcase-entry showcase-entry--title', getAnimationClass('zoomIn'))}>
          <TransparentButton
            onClick={() => setShowFilters(true)}
            className="showcase-image-button"
            hoverType="sepia"
          >
            <h1 className="showcase-title">
              <Translate pt="Vitrine" en="Showcase" />
            </h1>
            <Space className="space-container showcase-menu" align="center">
              <Avatar icon={<FilterFilled />} shape="circle" size="small" />
            </Space>
          </TransparentButton>
        </li>

        {orderBy(list, `title.${language}`).map((game, index) => {
          return (
            <li
              key={game.gameCode}
              className={clsx('showcase-entry', getAnimationClass('zoomIn', { delay: index + 0.3 }))}
            >
              <TransparentButton
                onClick={() => setShowModal(game.gameName)}
                className="showcase-image-button"
                hoverType="sepia"
              >
                <Image
                  alt={game.title[language]}
                  src={`${PUBLIC_URL.BANNERS}${game.gameName}-${language}.jpg`}
                  fallback={`${PUBLIC_URL.BANNERS}/em-breve-${language}.jpg`}
                  className="showcase-image"
                  preview={false}
                />
                <span className="showcase-popular-name">{game.popularName[language]}</span>
              </TransparentButton>
            </li>
          );
        })}
      </ul>

      <FiltersDrawer
        list={list}
        filters={filters}
        setFilters={setFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {Boolean(GAMES?.[showModal]) && (
        <Modal
          open={Boolean(showModal)}
          onOk={() => setShowModal('')}
          onCancel={() => setShowModal('')}
          title={GAMES[showModal].title[language]}
          centered
        >
          <GameDetailsContent game={GAMES[showModal]} />
        </Modal>
      )}
    </Layout.Content>
  );
}

export default Showcase;
