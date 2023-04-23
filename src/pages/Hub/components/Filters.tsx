import { FilterOutlined } from '@ant-design/icons';
import { Checkbox, InputNumber, Space, TreeSelect } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { useLanguage } from 'hooks/useLanguage';
import { capitalize } from 'lodash';
import { useMemo } from 'react';
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

  return (
    <Space className="hub-filters" wrap>
      <FilterOutlined />({availabilityCount}){' '}
      <div className="hub-filters__entry">
        <label>Players</label>
        <InputNumber
          min={2}
          max={12}
          size="small"
          className="hub-filters__input-number"
          onChange={(value) => onNumberFiltersUpdate('players', value ?? 0)}
        />
      </div>
      <div className="hub-filters__entry">
        <label>Recommended with</label>
        <Checkbox onChange={(e) => onNumberFiltersUpdate('recommendedWith', Number(e.target?.checked))} />
      </div>
      <div className="hub-filters__entry">
        <label>Best with</label>
        <Checkbox onChange={(e) => onNumberFiltersUpdate('bestWith', Number(e.target?.checked))} />
      </div>
      <div className="hub-filters__entry">
        <label>Duration</label>
        <InputNumber
          min={15}
          step={15}
          size="small"
          className="hub-filters__input-number"
          onChange={(value) => onNumberFiltersUpdate('duration', value ?? 0)}
        />
      </div>
      <div className="hub-filters__entry">
        <label>Tags</label>
        <TagTreeSelect value={undefined} onTreeSelectChange={setTagFilters} />
      </div>
    </Space>
  );
}

function TagTreeSelect({ value, onTreeSelectChange }: any) {
  const { dualTranslate } = useLanguage();

  const onChange = (tags: string[]) => {
    onTreeSelectChange(
      tags
      // .map((tag) => {
      //   if (tag.includes(SEPARATOR)) {
      //     return tag.split(SEPARATOR);
      //   }
      //   return tag;
      // })
      // .flat()
    );
  };

  const treeData: DefaultOptionType[] = useMemo(
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
        }, {})
      ),
    [dualTranslate]
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
