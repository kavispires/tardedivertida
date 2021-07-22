import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Input, Form, InputNumber, Switch } from 'antd';

export const ValueFormItem = ({ valueType }) => {
  switch (valueType) {
    case 'number':
      return (
        <Form.Item label="Value" name="value">
          <InputNumber />
        </Form.Item>
      );
    case 'boolean':
      return (
        <Form.Item label="Value" name="value">
          <Switch checkedChildren="true" unCheckedChildren="false" defaultChecked />
        </Form.Item>
      );
    case 'nullish':
      return (
        <Form.Item label="Value" name="value">
          <Switch checkedChildren="null" unCheckedChildren="undefined" defaultChecked />
        </Form.Item>
      );
    default:
      return (
        <Form.Item label="Value" name="value">
          <Input />
        </Form.Item>
      );
  }
};
ValueFormItem.propTypes = {
  valueType: PropTypes.string,
};
