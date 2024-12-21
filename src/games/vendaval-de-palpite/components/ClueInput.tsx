import clsx from "clsx";
import { useEffect, useState } from "react";
// Ant Design Resources
import { Input, Switch } from "antd";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Components
import { Translate } from "components/language";

type ClueInputProps = {
  id: string;
  onChangeInput?: GenericFunction;
  onPressEnter?: GenericFunction;
  value?: string;
  toggleGuessIds: GenericFunction;
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    toggleGuessIds(id, isGuess);
  }, [isGuess]);

  return (
    <div className={clsx("v-clue-input", isGuess && "v-clue-input--guess")}>
      <div className="v-clue-input__inner">
        <Input
          placeholder={
            disabled
              ? translate("Acabou o tempo", "Time's up")
              : translate("Escreva dica aqui", "Write here")
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
