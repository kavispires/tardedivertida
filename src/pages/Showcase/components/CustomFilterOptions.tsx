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
  const options = [
    { label: <Translate pt="Tanto faz" en="Whatever" />, value: 'any' },
    { label: <Translate pt={firstOption.text.pt} en={firstOption.text.en} />, value: firstOption.value },
    { label: <Translate pt={secondOption.text.pt} en={secondOption.text.en} />, value: secondOption.value },
  ];

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
