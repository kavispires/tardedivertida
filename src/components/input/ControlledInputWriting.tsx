import { type ReactNode, useState } from 'react';
// Ant Design Resources
import { Button, type ButtonProps, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { SEPARATOR } from 'utils/constants';

type ControlledInputWritingProps = {
  /**
   * Callback function when the form is submitted
   */
  onSubmit: GenericComponent;
  /**
   * The key used to store the value
   */
  valueKey: string;
  /**
   * Number of input fields to render
   */
  inputQuantity?: number;
  /**
   * Whether to restrict to maximum input quantity
   */
  restrictMax?: boolean;
  /**
   * The input component to render
   */
  inputComponent: GenericComponent;
  /**
   * Props to pass to the input component
   */
  inputComponentProps?: PlainObject;
  /**
   * Props to pass to the submit button
   */
  submitButtonProps?: ButtonProps;
  /**
   * Label for the submit button
   */
  submitButtonLabel: ReactNode;
};

export function ControlledInputWriting({
  onSubmit,
  inputQuantity = 1,
  restrictMax = true,
  valueKey,
  inputComponent,
  inputComponentProps = {},
  submitButtonProps = {},
  submitButtonLabel,
}: ControlledInputWritingProps) {
  const [values, setValues] = useState([]);
  const { isLoading } = useLoading();

  const onChangeInput = (e: any) => {
    const { id, value = '' } = e.target;
    if (id) {
      const indexStr = id.split(SEPARATOR)[1];
      const index = Number(indexStr);
      if (typeof index === 'number') {
        setValues((s: any) => {
          const newState = { ...s };
          newState[index] = value.toUpperCase().trim();
          return newState;
        });
      } else {
        console.error(`Index ${indexStr} for ${id} is not a number`);
      }
    }
  };

  const valuesCount = Object.values(values);

  // On enter in the easel if only one suggestion is necessary
  const onPressEnter = () => {
    if (restrictMax) {
      if (inputQuantity === valuesCount.length) {
        onSubmit({ [valueKey]: valuesCount });
      }
    } else {
      onSubmit(valuesCount);
    }
  };

  const InputComponent: any = inputComponent;

  return (
    <div className="full-width">
      <Space
        align="center"
        className="full-width padding div-container"
        wrap
        orientation="horizontal"
      >
        {Array(inputQuantity)
          .fill(0)
          .map((entry, index) => {
            const id = `input${SEPARATOR}${entry + index}`;
            return (
              <InputComponent
                key={id}
                id={id}
                onChangeInput={onChangeInput}
                onPressEnter={onPressEnter}
                disabled={isLoading}
                {...inputComponentProps}
              />
            );
          })}
      </Space>

      <Space
        align="center"
        className="full-width padding div-container"
      >
        <Button
          type="primary"
          onClick={() => onSubmit({ [valueKey]: valuesCount })}
          disabled={isLoading || restrictMax ? valuesCount.length < inputQuantity : false}
          size="large"
          {...submitButtonProps}
        >
          {submitButtonLabel}
        </Button>
      </Space>
    </div>
  );
}
