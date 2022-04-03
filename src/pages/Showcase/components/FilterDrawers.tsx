// Ant Design Resources
import { Button, Divider, Drawer, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// Hooks
import { useDimensions } from 'hooks';
// Components
import { LanguageSwitch, Translate } from 'components';
import { CustomFilterOptions } from './CustomFilterOptions';
import { FilterOptions } from './FilterOptions';

type FiltersDrawerProps = {
  list: GameInfo[];
  filters: PlainObject;
  setFilters: GenericFunction;
  showFilters: boolean;
  setShowFilters: GenericFunction;
};

export function FiltersDrawer({
  list,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}: FiltersDrawerProps) {
  const [width] = useDimensions('app');

  const updateFilters = (e: any) => {
    setFilters((s: PlainObject) => ({
      ...s,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Drawer
      visible={showFilters}
      title={<Translate pt={<>Filtros ({list.length} jogos)</>} en={<>Filters ({list.length} games)</>} />}
      placement="left"
      onClose={() => setShowFilters(false)}
      width={Math.min(width / 1.1, 600)}
      footer={
        <Space className="space-container" align="center">
          <Button onClick={() => setFilters({})}>
            <Translate pt="Limpar filtros" en="Clear filters" />
          </Button>
          <Button type="primary" onClick={() => setShowFilters(false)}>
            OK
          </Button>
        </Space>
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
  );
}
