import { Input, Switch } from 'antd';
import clsx from 'clsx';
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';
import { useEffect, useState } from 'react';

type ClueInputProps = {
  id: string;
  onChangeInput?: GenericFunction;
  onPressEnter?: GenericFunction;
  value?: string;
  toggleGuessIds: Function;
  disabled: boolean;
};

export function ClueInput({
  id,
  onChangeInput,
  onPressEnter,
  value,
  toggleGuessIds,
  disabled,
}: ClueInputProps) {
  const { translate } = useLanguage();
  const [isGuess, setIsGuess] = useState(false);

  useEffect(() => {
    toggleGuessIds(id, isGuess);
  }, [isGuess]); // eslint-disable-line

  return (
    <div className={clsx('v-clue-input', isGuess && 'v-clue-input--guess')}>
      <div className="v-clue-input__inner">
        <Input
          placeholder={
            disabled ? translate('Acabou o tempo', "Time's up") : translate('Escreva dica aqui', 'Write here')
          }
          key={id}
          id={id}
          value={value}
          onChange={onChangeInput}
          className="v-clue-input__input"
          bordered={false}
          onPressEnter={onPressEnter}
          autoComplete="off"
          disabled={disabled}
        />
      </div>
      <Switch
        className="v-clue-input__switch"
        size="small"
        unCheckedChildren={<Translate pt="Dica" en="Clue" />}
        checkedChildren={<Translate pt="Resposta" en="Guess" />}
        onChange={(e) => setIsGuess(e)}
      />
    </div>
  );
}
