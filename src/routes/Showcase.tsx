import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// Ant Design Resources
import { Button, Card, Divider, Drawer, Image, Layout, Modal, Radio, Space, Tag, Tooltip } from 'antd';
import { FilterFilled, InfoCircleOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import gameList from 'resources/games.json';
import { PUBLIC_URL, TAG_DICT } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
// Components
import { ButtonContainer, LanguageSwitch, RulesModal, Translate, TransparentButton } from 'components';

const GAMES: {
  [key: string]: GameInfo;
} = gameList;

const GAME_LIST: GameInfo[] = Object.values(gameList);

function Showcase() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState('');
  const [filters, setFilters] = useState<PlainObject>({ availability: true });

  const [list, setList] = useState<GameInfo[]>([]);

  // Load query params
  useEffect(() => {
    const searchAsObject = Object.fromEntries(new URLSearchParams(searchParams));
    if (Object.keys(searchAsObject).length > 0) {
      setFilters(searchAsObject);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    setList(filterGames(GAME_LIST, filters, language));
    const queryString = Object.keys(filters)
      .filter((key) => filters[key] !== 'any')
      .map((key) => `${key}=${filters[key]}`)
      .join('&');
    setSearchParams(queryString);
  }, [filters, language, setSearchParams]);

  const updateFilters = (e: any) => {
    setFilters((s: PlainObject) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout.Content className="showcase">
      <ul className="showcase-list">
        <li className={clsx('showcase-entry showcase-entry--title', getAnimationClass('zoomIn'))}>
          <h1 className="showcase-title">
            <Translate pt="Vitrine" en="Showcase" />
          </h1>
          <ButtonContainer className="showcase-menu">
            <Button
              icon={<FilterFilled />}
              shape="circle"
              size="small"
              onClick={() => setShowFilters(true)}
            />
          </ButtonContainer>
        </li>

        {list.map((game, index) => {
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

      <Drawer
        visible={showFilters}
        title={<Translate pt={<>Filtros ({list.length} jogos)</>} en={<>Filters ({list.length} games)</>} />}
        placement="left"
        onClose={() => setShowFilters(false)}
        width={600}
        footer={
          <Button block onClick={() => setFilters({})}>
            <Translate pt="Resetar filtros" en="Reset filters" />
          </Button>
        }
      >
        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Idioma" en="Language" />{' '}
            <Tooltip
              title={
                <Translate
                  pt="Mudar língua do aplicativo, as cartas do jogo continuarão em sua língua original"
                  en="Change app language, the game cards will remain in its original language"
                />
              }
            >
              <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
            </Tooltip>
          </label>
          <div>
            <LanguageSwitch />
          </div>
        </div>

        <Divider />

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Disponibilidade" en="Availability" />{' '}
            <Tooltip
              title={
                <Translate pt="Somente jogos prontos a serem jogados" en="Only games ready to be played" />
              }
            >
              <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
            </Tooltip>
          </label>
          <FilterOptions name="availability" value={filters?.availability} onChange={updateFilters} />
        </div>

        <Divider />

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Dinâmica" en="Dynamics" />{' '}
          </label>
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Tipo" en="Type" />{' '}
          </label>
          <CustomFilterOptions
            name="type"
            onChange={updateFilters}
            value={filters.type}
            firstOption={{
              value: 'competitive',
              text: {
                en: 'Competitive',
                pt: 'Competitivo',
              },
            }}
            secondOption={{
              value: 'cooperative',
              text: {
                en: 'Cooperative',
                pt: 'Cooperativo',
              },
            }}
          />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Rodadas" en="Rounds" />{' '}
          </label>
          <CustomFilterOptions
            name="rounds"
            onChange={updateFilters}
            value={filters.rounds}
            firstOption={{
              value: 'turn-based',
              text: {
                en: 'Turn Base',
                pt: 'Cada vez um',
              },
            }}
            secondOption={{
              value: 'same-time',
              text: {
                en: 'At the same time',
                pt: 'Todos juntos',
              },
            }}
          />
        </div>

        <Divider />

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Mecânica" en="Mechanics" />{' '}
          </label>
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="De desenhar" en="Drawing" />{' '}
          </label>
          <FilterOptions name="drawing" value={filters?.drawing} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="De escrever" en="Writing" />{' '}
          </label>
          <FilterOptions name="writing" value={filters?.writing} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Com cartas imagens" en="With images" />{' '}
          </label>
          <FilterOptions name="images" value={filters?.images} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="De adivinhar" en="With guessing" />{' '}
          </label>
          <FilterOptions name="guessing" value={filters?.guessing} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Com votação" en="With voting" />{' '}
          </label>
          <FilterOptions name="voting" value={filters?.voting} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Com tempo" en="Timed" />{' '}
          </label>
          <FilterOptions name="timed" value={filters?.timed} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Fazer Pares" en="Matching" />{' '}
          </label>
          <FilterOptions name="pairing" value={filters?.pairing} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="Com inimigo" en="With a traitor" />{' '}
          </label>
          <FilterOptions name="traitor" value={filters?.traitor} onChange={updateFilters} />
        </div>

        <div className="showcase-filter-entry">
          <label className="showcase-filter-entry__label">
            <Translate pt="De discussão" en="With discussion" />{' '}
          </label>
          <FilterOptions name="discussion" value={filters?.discussion} onChange={updateFilters} />
        </div>
      </Drawer>

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

type FilterOptionsProps = {
  name: string;
  value?: boolean | 'any';
  onChange: GenericFunction;
};

function FilterOptions({ name, value, onChange }: FilterOptionsProps) {
  return (
    <Radio.Group
      onChange={onChange}
      value={value}
      className="showcase-filter-options"
      size="small"
      name={name}
    >
      <Radio value={'any'} defaultChecked>
        <Translate pt="Tanto faz" en="Whatever" />
      </Radio>
      <Radio value={true}>
        <Translate pt="Sim" en="Yes" />
      </Radio>
      <Radio value={false}>
        <Translate pt="Não" en="No" />
      </Radio>
    </Radio.Group>
  );
}

type CustomFilterOptionsProps = {
  name: string;
  value?: string | 'any';
  onChange: GenericFunction;
  firstOption: {
    value: string;
    text: DualLanguageValue;
  };
  secondOption: {
    value: string;
    text: DualLanguageValue;
  };
};

function CustomFilterOptions({
  name,
  value = 'any',
  firstOption,
  secondOption,
  onChange,
}: CustomFilterOptionsProps) {
  return (
    <Radio.Group
      onChange={onChange}
      value={value}
      className="showcase-filter-options"
      size="small"
      name={name}
    >
      <Radio value={'any'} defaultChecked>
        <Translate pt="Tanto faz" en="Whatever" />
      </Radio>
      <Radio value={firstOption.value}>
        <Translate pt={firstOption.text.pt} en={firstOption.text.en} />
      </Radio>
      <Radio value={secondOption.value}>
        <Translate pt={secondOption.text.pt} en={secondOption.text.pt} />
      </Radio>
    </Radio.Group>
  );
}

function filterGames(list: GameInfo[], filters: PlainObject, language: Language) {
  return list.filter((game) => {
    let result: boolean[] = [];
    // Availability
    if (doesExist(filters.availability)) {
      const res = game.available[language] && !game.version.endsWith('alpha');
      result.push(filters.availability ? res : !res);
    }

    // Drawing
    evaluateTag(filters, game, 'drawing', result);

    // Writing
    evaluateTag(filters, game, 'writing', result);

    // Images
    evaluateTag(filters, game, 'images', result);

    // Voting
    evaluateTag(filters, game, 'voting', result);

    // Guessing
    evaluateTag(filters, game, 'guessing', result);

    // Time
    evaluateTag(filters, game, 'timed', result);

    // Pairing
    evaluateTag(filters, game, 'pairing', result);

    // Traitor
    evaluateTag(filters, game, 'traitor', result);

    // Discussion
    evaluateTag(filters, game, 'discussion', result);

    // Type
    evaluateCustomTag(filters, game, 'type', result);

    // Rounds
    evaluateCustomTag(filters, game, 'rounds', result);

    return result.every((r) => r);
  });
}

const doesExist = (property: any) => property !== undefined && property !== 'any';

const evaluateTag = (filters: PlainObject, game: GameInfo, tagName: string, result: boolean[]) => {
  if (doesExist(filters[tagName])) {
    const res = game.tags.includes(tagName);
    result.push(filters[tagName] ? res : !res);
  }
};

const evaluateCustomTag = (filters: PlainObject, game: GameInfo, tagName: string, result: boolean[]) => {
  if (doesExist(filters[tagName])) {
    const res = game.tags.includes(filters[tagName]);
    result.push(res);
  }
};

function GameDetailsContent({ game }: { game: GameInfo }) {
  const { language, translate } = useLanguage();
  return (
    <>
      <Image
        alt={game.title[language]}
        src={`${PUBLIC_URL.BANNERS}game-image-${game.gameName}-${language}.jpg`}
        fallback={`${PUBLIC_URL.BANNERS}/game-image-em-breve-${language}.jpg`}
      />
      <Card.Meta style={{ marginTop: '8px' }} description={game.summary[language]} />

      <Card.Meta
        style={{ marginTop: '8px' }}
        description={translate(
          `Para ${game.playerCount.min}-${game.playerCount.max} jogadores`,
          `For ${game.playerCount.min}-${game.playerCount.max} players`
        )}
      />
      <Card.Meta
        description={translate(
          `Recomendado jogar com ${game.playerCount.recommended}`,
          `Recommended with ${game.playerCount.recommended}`
        )}
      />

      <Space wrap size={[1, 6]} prefixCls={game.gameName} style={{ display: 'flex', marginTop: '12px' }}>
        {game.tags.map((tag) => (
          <Tag key={`${game.gameCode}-${tag}`} color={TAG_DICT[tag]?.color}>
            {language === 'pt' ? TAG_DICT[tag]?.label : tag}
          </Tag>
        ))}
      </Space>

      <Space style={{ marginTop: '12px' }}>
        {Boolean(game.rules?.[language]?.length > 1) && <RulesModal gameInfo={game} />}
      </Space>
    </>
  );
}

export default Showcase;
