import { Col, Input } from 'antd';

type TextAreaResultProps = {
  name: string;
  data?: PlainObject;
  isLoading?: boolean;
  xs?: number;
};

export function TextAreaResult({ data, name, isLoading = false, xs = 6 }: TextAreaResultProps) {
  return (
    <Col xs={xs}>
      <div>
        <h3>
          {name}
          {` (${Object.keys(data ?? {}).length})`}
        </h3>
        <Input.TextArea
          name="search-results"
          id=""
          cols={10}
          rows={10}
          readOnly
          value={isLoading ? 'Loading...' : JSON.stringify(data, null, 4)}
        />
      </div>
    </Col>
  );
}
