import { AutoComplete, Space } from 'antd';

import type { AlienItemDict, ItemId } from './types';

type SearchProps = {
  data: AlienItemDict;
  setItemId: React.Dispatch<React.SetStateAction<string>>;
};

export function Search({ data, setItemId }: SearchProps) {
  const namesDict = Object.values(data).reduce((acc: Record<string, ItemId>, entry) => {
    acc[entry.name.en] = entry.id;
    return acc;
  }, {});
  const names = Object.keys(namesDict).map((name) => ({ value: name }));

  const onSelect = (name: string) => {
    if (namesDict[name]) {
      setItemId(namesDict[name]);
    }
  };

  // const onSearch = (e: any) => console.log({ search: e });

  return (
    <Space>
      <AutoComplete
        options={names}
        style={{ width: 150 }}
        onSelect={onSelect}
        // onSearch={onSearch}
        placeholder="Go to..."
        filterOption={(inputValue, option) =>
          option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
    </Space>
  );
}
