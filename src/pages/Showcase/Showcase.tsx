import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Ant Design Resources
import { Button, Image, Layout, Modal, Space } from 'antd';
import { FilterFilled } from '@ant-design/icons';
// Hooks
import { useDimensions, useGlobalState, useLanguage } from 'hooks';
// Utils
import gameList from 'assets/data/games.json';
import { PUBLIC_URL } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { Translate, TransparentButton } from 'components';
import { FiltersDrawer } from './components/FilterDrawers';
import { GameDetailsContent } from './components/GameDetailsContent';
import { filterGames } from './helpers';

const GAMES: {
  [key: string]: GameInfo;
} = gameList;

const GAME_LIST: GameInfo[] = Object.values(gameList);

function Showcase() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [width] = useDimensions('app');
  const [, setLanguage] = useGlobalState('language');

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState('');
  const [filters, setFilters] = useState<PlainObject>({ availability: true });

  const [list, setList] = useState<GameInfo[]>([]);

  // Load query params
  useEffect(() => {
    const searchAsObject = Object.fromEntries(new URLSearchParams(searchParams));
    if (Object.keys(searchAsObject).length > 0) {
      const parsedQP = Object.entries(searchAsObject).reduce((acc: BooleanDictionary, [key, value]) => {
        if (value === 'false' || value === 'true') {
          acc[key] = value === 'true';
        }
        if (key === 'language' && value === 'en') {
          setLanguage('en');
        }
        return acc;
      }, {});

      setFilters(parsedQP);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    setList(filterGames(GAME_LIST, filters, language, setLanguage));
    let queryString = Object.keys(filters)
      .filter((key) => filters[key] !== 'any')
      .map((key) => `${key}=${filters[key]}`)
      .join('&');
    if (language !== 'pt') {
      queryString += `&language=${language}`;
    }
    setSearchParams(queryString);
  }, [filters, language, setSearchParams, setLanguage]);

  return (
    <Layout.Content className="showcase">
      <ul className="showcase-list" style={{ gridTemplateColumns: `repeat(${width > 450 ? 4 : 2}, 1fr)` }}>
        <li className={clsx('showcase-entry showcase-entry--title', getAnimationClass('zoomIn'))}>
          <TransparentButton onClick={() => setShowFilters(true)} className="showcase-image-button">
            <h1 className="showcase-title">
              <Translate pt="Vitrine" en="Showcase" />
            </h1>
            <Space className="space-container showcase-menu" align="center">
              <Button
                icon={<FilterFilled />}
                shape="circle"
                size="small"
                onClick={() => setShowFilters(true)}
              />
            </Space>
          </TransparentButton>
        </li>

        {orderBy(list, `title.${language}`).map((game, index) => {
          return (
            <li
              key={game.gameCode}
              className={clsx('showcase-entry', getAnimationClass('zoomIn', index + 0.3))}
            >
              <TransparentButton
                onClick={() => setShowModal(game.gameCode)}
                className="showcase-image-button"
              >
                <Image
                  alt={game.title[language]}
                  src={`${PUBLIC_URL.BANNERS}game-image-${game.gameName}-${language}.jpg`}
                  fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
                  className="showcase-image"
                  preview={false}
                />
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
          visible={Boolean(showModal)}
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
