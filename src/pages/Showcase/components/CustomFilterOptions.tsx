// Ant Design Resources
import { Radio } from 'antd';
// Components
import { Translate } from 'components/language';

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

export function CustomFilterOptions({
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
