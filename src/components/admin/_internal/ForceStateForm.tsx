import { useState } from 'react';
// Design Resources
import { Button, Form, Select, AutoComplete, message } from 'antd';
// Components
import { ValueFormItem } from './ValueFormItem';
import { ADMIN_ACTIONS } from 'utils/constants';

type ForceStateFormProps = {
  isLoading?: boolean;
  state: GameState;
  onPerformAdminAction: GenericFunction;
};

export const ForceStateForm = ({ isLoading, state, onPerformAdminAction }: ForceStateFormProps) => {
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState('string');
  const stateKeys = Object.keys(state).map((k) => ({ label: k, value: k }));

  const onValueTypeSelectChange = (newType: any) => {
    if (['boolean', 'nullish'].includes(newType)) form.setFieldsValue({ value: true });
    if (newType === 'number') form.setFieldsValue({ value: 0 });
    if (newType === 'string') form.setFieldsValue({ value: '' });
    setValueType(newType);
  };

  const onFinish = async (e: any) => {
    let parsedValue = e.value;

    try {
      if (e.valueType === 'number') {
        parsedValue = Number(e.value) ?? 0;
      }
      if (e.valueType === 'nullish') {
        parsedValue = e.value ? null : undefined;
      }

      const payload = {
        [e.key]: parsedValue,
      };

      if (window.confirm(`Tem certeza que quer forçar o estado ${JSON.stringify(payload)}`)) {
        await onPerformAdminAction({ state: payload, action: ADMIN_ACTIONS.FORCE_STATE_PROPERTY });

        form.resetFields();
        setValueType('string');
      }
    } catch (e: any) {
      message.error('Something went wrong', e);
    }
  };

  return (
    <Form name="basic" form={form} initialValues={{ valueType: 'string' }} onFinish={onFinish}>
      <h3>Force Property</h3>
      <Form.Item label="Key" name="key" rules={[{ required: true }]}>
        <AutoComplete options={stateKeys} />
      </Form.Item>
      <Form.Item label="Type" name="valueType">
        <Select onChange={onValueTypeSelectChange}>
          <Select.Option value="string">string</Select.Option>
          <Select.Option value="number">number</Select.Option>
          <Select.Option value="boolean">boolean</Select.Option>
          <Select.Option value="nullish">nullish</Select.Option>
        </Select>
      </Form.Item>

      <ValueFormItem valueType={valueType} />

      <Button type="primary" htmlType="submit" disabled={isLoading} danger>
        Submit
      </Button>
    </Form>
  );
};
