import clsx from 'clsx';
// Ant Design Resources
import { Typography, Switch, Radio, Checkbox } from 'antd';
// Types
import type { GameInfo, GameInfoOption } from 'types/game-info';
// Components
import { Translate } from 'components/language';
// Adapters
// Hooks
// Constants

type GameCustomizationsProps = {
  options?: GameInfo['options'];
  disabled: boolean;
  onChangeOptions: GenericFunction;
  selectedOptions: PlainObject;
};

export function GameCustomizations({
  options = [],
  disabled,
  onChangeOptions,
  selectedOptions,
}: GameCustomizationsProps) {
  if (!options) {
    return (
      <div className="create-game-modal-options create-game-modal-options__no-options">
        <Typography.Text>
          <Translate pt="Este jogo não possui customizações" en="This game does not support customizations" />
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className="create-game-modal-options">
      <Typography.Title level={5} className="create-game-modal-options__title">
        <Translate pt="Opções:" en="Options:" />
      </Typography.Title>
      <div className="create-game-modal-options__list">
        {(options ?? []).map((option) => (
          <Typography.Paragraph
            key={`option-${option.label}`}
            className={clsx(
              'create-game-modal-options__option',
              option.disabled && 'create-game-modal-options__option--disabled',
            )}
          >
            <div className="create-game-modal-options__label">
              <span>{option.label}</span>
              {option.kind !== 'switch' && Boolean(option.description) && (
                <div className="create-game-modal-options__option-description">{option.description}</div>
              )}
            </div>

            {option.kind === 'switch' && (
              <SwitchOptions
                option={option}
                disabled={disabled}
                onChangeOptions={onChangeOptions}
                selectedOptions={selectedOptions}
              />
            )}
            {option.kind === 'radio' && (
              <RadioOptions
                option={option}
                disabled={disabled}
                onChangeOptions={onChangeOptions}
                selectedOptions={selectedOptions}
              />
            )}
            {option.kind === 'checkbox' && (
              <CheckboxOptions
                option={option}
                disabled={disabled}
                onChangeOptions={onChangeOptions}
                selectedOptions={selectedOptions}
              />
            )}

            {option.kind === 'switch' && Boolean(option.description) && (
              <span className="create-game-modal-options__option-description">{option.description}</span>
            )}
          </Typography.Paragraph>
        ))}
      </div>
    </div>
  );
}

type OptionProps = {
  option: GameInfoOption;
  disabled?: boolean;
  onChangeOptions: GenericFunction;
  selectedOptions: PlainObject;
};

function SwitchOptions({ option, disabled, onChangeOptions, selectedOptions }: OptionProps) {
  return (
    <>
      <span
        className={clsx(
          'create-game-modal-options__off',
          !selectedOptions[option.key] && 'create-game-modal-options--selected',
        )}
      >
        {option?.values[0].label ?? ''}
      </span>
      <Switch disabled={disabled || option.disabled} onChange={(e) => onChangeOptions(option.key, e)} />
      <span
        className={clsx(
          'create-game-modal-options__on',
          selectedOptions[option.key] && 'create-game-modal-options--selected',
        )}
      >
        {option?.values[1].label ?? ''}
      </span>
    </>
  );
}

function RadioOptions({ option, disabled, onChangeOptions }: OptionProps) {
  return (
    <Radio.Group
      disabled={disabled || option.disabled}
      onChange={(e) => onChangeOptions(option.key, e.target.value)}
      defaultValue={option.values[0].value}
      className="create-game-modal-options__selections"
    >
      {option.values.map((value) => (
        <Radio key={String(value.value)} value={value.value}>
          {value.label}
        </Radio>
      ))}
    </Radio.Group>
  );
}

function CheckboxOptions({ option, disabled, onChangeOptions }: OptionProps) {
  return (
    <Checkbox.Group
      disabled={disabled || option.disabled}
      onChange={(v) => onChangeOptions(option.key, v)}
      className="create-game-modal-options__selections"
      options={option.values}
    />
  );
}
