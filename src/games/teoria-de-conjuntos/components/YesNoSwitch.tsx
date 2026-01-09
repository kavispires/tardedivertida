// Ant Design Resources
import { Switch, type SwitchProps } from 'antd';
// Components
import { Translate } from 'components/language';

export function YesNoSwitch({ checkedChildren, unCheckedChildren, ...props }: SwitchProps) {
  return (
    <Switch
      checkedChildren={
        checkedChildren ?? (
          <Translate
            en="Yes"
            pt="Sim"
          />
        )
      }
      unCheckedChildren={
        unCheckedChildren ?? (
          <Translate
            en="No"
            pt="Não"
          />
        )
      }
      {...props}
    />
  );
}
