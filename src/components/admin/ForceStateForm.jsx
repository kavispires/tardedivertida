import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, Form, Select, AutoComplete, message } from 'antd';
// Components
import { ValueFormItem } from './ValueFormItem';

export const ForceStateForm = ({ isLoading, state, onForceStateProperty }) => {
  const [form] = Form.useForm();
  const [valueType, setValueType] = useState('string');
  const stateKeys = Object.keys(state).map((k) => ({ label: k, value: k }));

  const onValueTypeSelectChange = (newType) => {
    if (['boolean', 'nullish'].includes(newType)) form.setFieldsValue({ value: true });
    if (newType === 'number') form.setFieldsValue({ value: 0 });
    if (newType === 'string') form.setFieldsValue({ value: '' });
    setValueType(newType);
  };

  const onFinish = async (e) => {
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
        await onForceStateProperty({ state: payload });

        form.resetFields();
        setValueType('string');
      }
    } catch (e) {
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

ForceStateForm.propTypes = {
  isLoading: PropTypes.bool,
  onForceStateProperty: PropTypes.func.isRequired,
  state: PropTypes.object,
};
