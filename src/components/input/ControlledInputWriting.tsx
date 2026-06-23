import { type ReactNode, useState } from 'react';
// Ant Design Resources
import { Button, type ButtonProps, Space } from 'antd';
// Hooks
import { useLoading } from '@hooks/useLoading';
// Utils
import { SEPARATOR } from '@utils/constants';
// Components
import { SpaceFloat } from '@components/layout/SpaceFloat';

type InputComponentBaseProps = {
  id: string;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter: () => void;
  disabled: boolean;
};

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

/**
 * Controlled input component with dynamic input fields that validates and submits multiple text values
 */
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
  const [values, setValues] = useState<Record<number, string>>({});
  const { isLoading } = useLoading();

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value = '' } = e.target;
    if (id) {
      const indexStr = id.split(SEPARATOR)[1];
      const index = Number(indexStr);
      if (typeof index === 'number') {
        setValues((s) => {
          const newState = { ...s };
          newState[index] = value.toUpperCase().trim();
          return newState;
        });
      } else {
        // biome-ignore lint/suspicious/noConsole: on purpose
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

  const InputComponent = inputComponent as React.ComponentType<InputComponentBaseProps & PlainObject>;

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

      <SpaceFloat
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
      </SpaceFloat>
    </div>
  );
}
