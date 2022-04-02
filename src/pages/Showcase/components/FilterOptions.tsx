// Ant Design Resources
import { Radio } from 'antd';

// Components
import { Translate } from 'components';

type FilterOptionsProps = {
  name: string;
  value?: boolean | 'any';
  onChange: GenericFunction;
};

export function FilterOptions({ name, value, onChange }: FilterOptionsProps) {
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
