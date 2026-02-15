import { capitalize } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { ClearOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, InputNumber, Select, Space, type TreeDataNode, TreeSelect } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { SEPARATOR, TAG_DICT } from 'utils/constants';

const { SHOW_PARENT } = TreeSelect;

export type FilterState = {
  /**
   * Search text for title/game name
   */
  search: string;
  /**
   * Selected tags
   */
  tags: string[];
  /**
   * Number of players
   */
  players: number;
  /**
   * Recommended player count mode
   */
  recommendedWith: boolean;
  /**
   * Best player count mode
   */
  bestWith: boolean;
  /**
   * Duration in minutes
   */
  duration: number;
  /**
   * Release status filter
   */
  releaseStatus: string[];
  /**
   * Sort by (title or release date)
   */
  sortBy: 'title' | 'release-date';
};

type FiltersProps = {
  /**
   * Callback to update all filters
   */
  setFilters: (filters: FilterState) => void;
  /**
   * Current filter state
   */
  filters: FilterState;
  /**
   * Number of games matching the filters
   */
  availabilityCount: number;
};

export function Filters({ availabilityCount, filters, setFilters }: FiltersProps) {
  const { translate } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const onPlayingSelectChange = (value: string) => {
    setFilters({
      ...filters,
      recommendedWith: value === 'recommended',
      bestWith: value === 'best',
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      tags: [],
      players: 0,
      recommendedWith: false,
      bestWith: false,
      duration: 0,
      releaseStatus: [],
      sortBy: 'title',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.tags.length > 0 ||
    filters.players > 0 ||
    filters.duration > 0 ||
    filters.releaseStatus.length > 0;

  const playingOptions = [
    {
      label: translate('Qualquer', 'Any'),
      value: '',
    },
    {
      label: translate('Recomendado com', 'Recommended with'),
      value: 'recommended',
    },
    {
      label: translate('Melhor com', 'Best with'),
      value: 'best',
    },
  ];

  const releaseStatusOptions = [
    {
      label: translate('Estável', 'Stable'),
      value: 'stable',
    },
    {
      label: translate('Beta/Dev', 'Beta/Dev'),
      value: 'dev',
    },
    {
      label: translate('Em Breve', 'Coming Soon'),
      value: 'soon',
    },
  ];

  const sortOptions = [
    {
      label: translate('Título', 'Title'),
      value: 'title',
    },
    {
      label: translate('Data de Lançamento', 'Release Date'),
      value: 'release-date',
    },
  ];

  const getCurrentPlayingValue = () => {
    if (filters.recommendedWith) return 'recommended';
    if (filters.bestWith) return 'best';
    return '';
  };

  return (
    <div className="hub-filters">
      {/* Main Filter Bar - Always Visible */}
      <Space
        wrap
        size="middle"
        style={{ width: '100%', marginBottom: 16 }}
      >
        <span style={{ fontWeight: 'bold', fontSize: 16 }}>
          <FilterOutlined /> {translate('Filtros', 'Filters')} ({availabilityCount})
        </span>

        {/* Search Input */}
        <Input
          placeholder={translate('Buscar por título ou nome...', 'Search by title or name...')}
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          style={{ minWidth: 300, maxWidth: 400 }}
          allowClear
        />

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label
            htmlFor="sort-by"
            style={{ fontSize: 14 }}
          >
            {translate('Ordenar por:', 'Sort by:')}
          </label>
          <Select
            id="sort-by"
            value={filters.sortBy}
            style={{ minWidth: 180 }}
            size="small"
            onChange={(value) => updateFilter('sortBy', value as 'title' | 'release-date')}
            options={sortOptions}
          />
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            icon={<ClearOutlined />}
            onClick={clearAllFilters}
            size="small"
            danger
          >
            {translate('Limpar', 'Clear')}
          </Button>
        )}

        {/* Expand/Collapse Button */}
        <Button
          type="link"
          onClick={() => setIsExpanded(!isExpanded)}
          size="small"
        >
          {isExpanded
            ? translate('Menos filtros', 'Fewer filters')
            : translate('Mais filtros', 'More filters')}
        </Button>
      </Space>

      {/* Advanced Filters - Collapsible */}
      {isExpanded && (
        <Collapse
          defaultActiveKey={['player-filters', 'game-filters']}
          bordered={false}
          size="small"
        >
          <Collapse.Panel
            header={translate('Filtros de Jogadores e Tempo', 'Player & Time Filters')}
            key="player-filters"
          >
            <Space
              wrap
              size="middle"
            >
              <div className="hub-filters__entry">
                <label htmlFor="players-input">{translate('Jogadores', 'Players')}</label>
                <InputNumber
                  id="players-input"
                  min={0}
                  max={13}
                  size="small"
                  className="hub-filters__input-number"
                  value={filters.players || undefined}
                  onChange={(value) => updateFilter('players', value ?? 0)}
                  placeholder={translate('Todos', 'All')}
                />
              </div>

              {filters.players > 0 && (
                <div className="hub-filters__entry">
                  <label htmlFor="playing-mode">{translate('Modo', 'Mode')}</label>
                  <Select
                    id="playing-mode"
                    value={getCurrentPlayingValue()}
                    style={{ minWidth: '20ch' }}
                    size="small"
                    onChange={onPlayingSelectChange}
                    options={playingOptions}
                  />
                </div>
              )}

              <div className="hub-filters__entry">
                <label htmlFor="duration">{translate('Duração (min)', 'Duration (min)')}</label>
                <InputNumber
                  id="duration"
                  min={0}
                  step={15}
                  size="small"
                  className="hub-filters__input-number"
                  value={filters.duration || undefined}
                  onChange={(value) => updateFilter('duration', value ?? 0)}
                  placeholder={translate('Qualquer', 'Any')}
                />
              </div>
            </Space>
          </Collapse.Panel>

          <Collapse.Panel
            header={translate('Filtros de Jogo', 'Game Filters')}
            key="game-filters"
          >
            <Space
              wrap
              size="middle"
              orientation="vertical"
              style={{ width: '100%' }}
            >
              <div className="hub-filters__entry">
                <label htmlFor="tags">{translate('Tags', 'Tags')}</label>
                <TagTreeSelect
                  value={filters.tags}
                  onTreeSelectChange={(tags: string[]) => updateFilter('tags', tags)}
                />
              </div>

              <div className="hub-filters__entry">
                <label htmlFor="release-status">{translate('Status de Lançamento', 'Release Status')}</label>
                <Select
                  id="release-status"
                  mode="multiple"
                  style={{ minWidth: 300 }}
                  size="small"
                  value={filters.releaseStatus}
                  onChange={(value) => updateFilter('releaseStatus', value)}
                  options={releaseStatusOptions}
                  placeholder={translate('Todos os status', 'All statuses')}
                  allowClear
                />
              </div>
            </Space>
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
}

type TagTreeSelectProps = {
  /**
   * Selected tags
   */
  value: string[];
  /**
   * Callback to update selected tags
   */
  onTreeSelectChange: (tags: string[]) => void;
};

function TagTreeSelect({ value, onTreeSelectChange }: TagTreeSelectProps) {
  const { dualTranslate, translate } = useLanguage();

  const onChange = (tags: string[]) => {
    onTreeSelectChange(tags);
  };

  const treeData: TreeDataNode[] = useMemo(() => {
    const groupedTags = Object.keys(TAG_DICT).reduce((acc: Record<string, TreeDataNode>, tagKey: string) => {
      const tagObj = TAG_DICT[tagKey];
      if (acc[tagObj.group] === undefined) {
        acc[tagObj.group] = {
          title: capitalize(tagObj.group),
          key: tagObj.group,
          children: [],
          selectable: false,
        };
      }

      const children = acc[tagObj.group].children ?? [];
      children.push({
        title: capitalize(dualTranslate(tagObj.label)),
        key: `${tagObj.group}${SEPARATOR}${tagKey}`,
      });
      acc[tagObj.group].children = children;

      return acc;
    }, {});

    return Object.values(groupedTags);
  }, [dualTranslate]);

  return (
    <TreeSelect
      treeData={treeData}
      value={value.length > 0 ? value : undefined}
      onChange={onChange}
      treeCheckable={true}
      showCheckedStrategy={SHOW_PARENT}
      placeholder={translate('Selecione tags de jogo', 'Select game tags')}
      size="small"
      style={{
        width: '100%',
        minWidth: 300,
      }}
      maxTagCount="responsive"
      allowClear
    />
  );
}
