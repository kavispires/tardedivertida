import { capitalize } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { FilterOutlined } from '@ant-design/icons';
import { InputNumber, Select, Space, type TreeDataNode, TreeSelect } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { SEPARATOR, TAG_DICT } from 'utils/constants';

const { SHOW_PARENT } = TreeSelect;

type FiltersProps = {
  setTagFilters: GenericFunction;
  setNumberFilters: GenericFunction;
  availabilityCount: number;
};
export function Filters({ availabilityCount, setTagFilters, setNumberFilters }: FiltersProps) {
  const onNumberFiltersUpdate = (key: string, value: number) => {
    setNumberFilters((prevState: NumberDictionary) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const onPlayingSelectChange = (value: string) => {
    onNumberFiltersUpdate('recommendedWith', Number(value === 'recommended'));
    onNumberFiltersUpdate('bestWith', Number(value === 'best'));
  };

  return (
    <Space className="hub-filters" wrap size="middle">
      <span>
        <FilterOutlined /> ({availabilityCount})
      </span>
      <Select defaultValue="" style={{ minWidth: '20ch' }} size="small" onChange={onPlayingSelectChange}>
        <Select.Option value="">Playing with</Select.Option>
        <Select.Option value="recommended">Recommended with</Select.Option>
        <Select.Option value="best">Best with</Select.Option>
      </Select>
      <div className="hub-filters__entry">
        <label htmlFor="players-input">Players</label>
        <InputNumber
          id="players-input"
          min={2}
          max={12}
          size="small"
          className="hub-filters__input-number"
          onChange={(value) => onNumberFiltersUpdate('players', value ?? 0)}
        />
      </div>
      <div className="hub-filters__entry">
        <label htmlFor="duration">Duration</label>
        <InputNumber
          id="duration"
          min={15}
          step={15}
          size="small"
          className="hub-filters__input-number"
          onChange={(value) => onNumberFiltersUpdate('duration', value ?? 0)}
        />
      </div>
      <div className="hub-filters__entry">
        <label htmlFor="tags">Tags</label>
        <TagTreeSelect value={undefined} onTreeSelectChange={setTagFilters} />
      </div>
    </Space>
  );
}

function TagTreeSelect({ value, onTreeSelectChange }: any) {
  const { dualTranslate } = useLanguage();

  const onChange = (tags: string[]) => {
    onTreeSelectChange(
      tags,
      // .map((tag) => {
      //   if (tag.includes(SEPARATOR)) {
      //     return tag.split(SEPARATOR);
      //   }
      //   return tag;
      // })
      // .flat()
    );
  };

  const treeData: TreeDataNode[] = useMemo(
    () =>
      Object.values(
        Object.keys(TAG_DICT).reduce((acc: any, tagKey: string) => {
          const tagObj = TAG_DICT[tagKey];
          if (acc[tagObj.group] === undefined) {
            acc[tagObj.group] = {
              title: capitalize(tagObj.group),
              value: tagObj.group,
              children: [],
            };
          }

          acc[tagObj.group].children.push({
            title: capitalize(dualTranslate(tagObj.label)),
            value: `${tagObj.group}${SEPARATOR}${tagKey}`,
          });

          return acc;
        }, {}),
      ),
    [dualTranslate],
  );

  return (
    <TreeSelect
      treeData={treeData}
      value={value}
      onChange={onChange}
      treeCheckable={true}
      showCheckedStrategy={SHOW_PARENT}
      placeholder="Select Game Tags"
      size="small"
      style={{
        width: '100%',
        minWidth: '400px',
      }}
    />
  );
}
