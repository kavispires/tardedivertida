// Ant Design Resources
import { Form, Input, InputNumber, Switch } from 'antd';

type ValueFormItemProps = {
  /**
   * The input value type
   */
  valueType?: string;
};

export const ValueFormItem = ({ valueType }: ValueFormItemProps) => {
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
