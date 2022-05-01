// Ant Design Resources
import { Button, Divider, Drawer, Space } from 'antd';
// Hooks
import { useDimensions } from 'hooks';
// Components
import { LanguageSwitch, Translate } from 'components/language';
import { CustomFilterOptions } from './CustomFilterOptions';
import { FilterOptions } from './FilterOptions';
import { FilterEntry } from './FilterEntry';

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
      <FilterEntry
        label={<Translate pt="Idioma" en="Language" />}
        tooltip={
          <Translate
            pt="Mudar língua do aplicativo, as cartas do jogo continuarão em sua língua original"
            en="Change app language, the game cards will remain in its original language"
          />
        }
      >
        <LanguageSwitch />
      </FilterEntry>

      <Divider />

      <FilterEntry
        label={<Translate pt="Disponibilidade" en="Availability" />}
        tooltip={<Translate pt="Somente jogos prontos a serem jogados" en="Only games ready to be played" />}
      >
        <FilterOptions name="availability" value={filters?.availability} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry
        label={<Translate pt="Aparelho Móvel" en="Mobile Friendly" />}
        tooltip={
          <Translate
            pt="Dá pra jogar no iPad/Tablet e talvez no celular"
            en="You may play on your tablet and possibly on a phone"
          />
        }
      >
        <FilterOptions name="mobile-friendly" value={filters?.['mobile-friendly']} onChange={updateFilters} />
      </FilterEntry>

      <Divider />

      <div className="showcase-filter-section">
        <label className="showcase-filter-entry__label">
          <Translate pt="Dinâmicas" en="Dynamics" />{' '}
        </label>
      </div>

      <FilterEntry label={<Translate pt="Tipo" en="Type" />}>
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
      </FilterEntry>

      <FilterEntry label={<Translate pt="Rodadas" en="Rounds" />}>
        <CustomFilterOptions
          name="rounds"
          onChange={updateFilters}
          value={filters.rounds}
          firstOption={{
            value: 'turn-based',
            text: {
              en: 'Turn Based',
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
      </FilterEntry>

      <Divider />

      <div className="showcase-filter-section">
        <label className="showcase-filter-entry__label">
          <Translate pt="Mecânicas" en="Mechanics" />{' '}
        </label>
      </div>

      <FilterEntry label={<Translate pt="De desenhar" en="Drawing" />}>
        <FilterOptions name="drawing" value={filters?.drawing} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="De escrever" en="Writing" />}>
        <FilterOptions name="writing" value={filters?.writing} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="Com cartas imagens" en="With images" />}>
        <FilterOptions name="images" value={filters?.images} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="De adivinhar" en="With guessing" />}>
        <FilterOptions name="guessing" value={filters?.guessing} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="Com votação" en="With voting" />}>
        <FilterOptions name="voting" value={filters?.voting} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="Com tempo" en="Timed" />}>
        <FilterOptions name="timed" value={filters?.timed} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="Fazer Pares" en="Matching" />}>
        <FilterOptions name="pairing" value={filters?.pairing} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="Com inimigo" en="With a traitor" />}>
        <FilterOptions name="traitor" value={filters?.traitor} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="De discussão" en="With discussion" />}>
        <FilterOptions name="discussion" value={filters?.discussion} onChange={updateFilters} />
      </FilterEntry>

      <FilterEntry label={<Translate pt="De tentar a sorte" en="Push your luck" />}>
        <FilterOptions name="push-your-luck" value={filters?.discussion} onChange={updateFilters} />
      </FilterEntry>
    </Drawer>
  );
}
