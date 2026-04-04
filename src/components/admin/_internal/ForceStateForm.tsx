import { useState } from 'react';
// Ant Design Resources
import { AutoComplete, Button, Form, Select, App } from 'antd';
// Types
import type { GameState } from 'types/game';
// Services
import { HOST_API_ACTIONS } from 'services/adapters';
// Internal
import { ValueFormItem } from './ValueFormItem';

type ValueType = 'string' | 'number' | 'boolean' | 'nullish';

type FormValues = {
  key: string;
  value: string | number | boolean;
  valueType: ValueType;
};

type ForceStateFormProps = {
  /**
   * The loading state
   */
  isLoading?: boolean;
  /**
   * The game state
   */
  state: GameState;
  /**
   * The admin action being performed
   */
  onPerformAdminAction: (params: { state: Partial<GameState>; action: string }) => Promise<void>;
};

export const ForceStateForm = ({ isLoading, state, onPerformAdminAction }: ForceStateFormProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState('string');
  const stateKeys = Object.keys(state).map((k) => ({ label: k, value: k }));

  const onValueTypeSelectChange = (newType: ValueType) => {
    if (['boolean', 'nullish'].includes(newType)) form.setFieldsValue({ value: true });
    if (newType === 'number') form.setFieldsValue({ value: 0 });
    if (newType === 'string') form.setFieldsValue({ value: '' });
    setValueType(newType);
  };

  const onFinish = async (values: FormValues) => {
    let parsedValue: string | number | boolean | null | undefined = values.value;

    try {
      if (values.valueType === 'number') {
        parsedValue = Number(values.value) ?? 0;
      }
      if (values.valueType === 'nullish') {
        parsedValue = values.value ? null : undefined;
      }

      const payload = {
        [values.key]: parsedValue,
      };

      if (window.confirm(`Tem certeza que quer forçar o estado ${JSON.stringify(payload)}`)) {
        await onPerformAdminAction({ state: payload, action: HOST_API_ACTIONS.FORCE_STATE_PROPERTY });

        form.resetFields();
        setValueType('string');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.error(`Something went wrong: ${errorMessage}`);
    }
  };

  return (
    <Form
      name="basic"
      form={form}
      initialValues={{ valueType: 'string' }}
      onFinish={onFinish}
    >
      <h3>Force Property</h3>
      <Form.Item
        label="Key"
        name="key"
        rules={[{ required: true }]}
      >
        <AutoComplete options={stateKeys} />
      </Form.Item>
      <Form.Item
        label="Type"
        name="valueType"
      >
        <Select onChange={onValueTypeSelectChange}>
          <Select.Option value="string">string</Select.Option>
          <Select.Option value="number">number</Select.Option>
          <Select.Option value="boolean">boolean</Select.Option>
          <Select.Option value="nullish">nullish</Select.Option>
        </Select>
      </Form.Item>

      <ValueFormItem valueType={valueType} />

      <Button
        type="primary"
        htmlType="submit"
        disabled={isLoading}
        danger
      >
        Submit
      </Button>
    </Form>
  );
};
