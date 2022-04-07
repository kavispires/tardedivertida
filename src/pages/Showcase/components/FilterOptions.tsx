// Ant Design Resources
import { Radio } from 'antd';

// Components
import { Translate } from 'components/language';

type FilterOptionsProps = {
  name: string;
  value?: 'on' | 'off' | 'any';
  onChange: GenericFunction;
};

const options = [
  { label: <Translate pt="Tanto faz" en="Whatever" />, value: 'any' },
  { label: <Translate pt="Sim" en="Yes" />, value: 'on' },
  { label: <Translate pt="Não" en="No" />, value: 'off' },
];

export function FilterOptions({ name, onChange, value = 'any' }: FilterOptionsProps) {
  return (
    <Radio.Group
      onChange={onChange}
      value={value}
      className="showcase-filter-options"
      size="small"
      name={name}
      optionType="button"
      buttonStyle={value !== 'any' ? 'solid' : 'outline'}
      options={options}
    />
  );
}
