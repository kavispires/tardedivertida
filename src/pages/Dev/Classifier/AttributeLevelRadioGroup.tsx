import { Radio, RadioChangeEvent } from 'antd';

type AttributeLevelRadioGroupProps = {
  value: number;
  onChange: (e: RadioChangeEvent) => void;
};

export function AttributeLevelRadioGroup({ value, onChange }: AttributeLevelRadioGroupProps) {
  return (
    <Radio.Group value={value} onChange={onChange} optionType="button" buttonStyle="solid">
      <Radio.Button type="primary" value={-5}>
        -5
      </Radio.Button>
      <Radio.Button value={-3}>-3</Radio.Button>
      <Radio.Button value={-1}>-1</Radio.Button>
      <Radio.Button
        value={0}
        style={{
          backgroundColor: value === 0 ? 'red' : 'white',
        }}
      >
        0
      </Radio.Button>
      <Radio.Button value={1}>1</Radio.Button>
      <Radio.Button value={3}>3</Radio.Button>
      <Radio.Button value={5}>5</Radio.Button>
    </Radio.Group>
  );
}
