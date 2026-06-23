// Ant Design Resources
import { Select } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Components
import { Translate } from '@components/language/Translate';
// Internal
import type { BracketTier, FightingContender } from '../utils/type';

type ContendersSelectProps = {
  contenders: FightingContender[];
  updateBet: (value: Dictionary<string>) => void;
  betTier: BracketTier;
  userContenders: UID[];
};

export function ContendersSelect({ contenders, updateBet, betTier, userContenders }: ContendersSelectProps) {
  const { translate } = useLanguage();

  return (
    <Select
      className="w-bet-form__select"
      defaultValue=""
      onChange={(id) => updateBet({ [betTier]: id })}
      options={[
        {
          value: '',
          disabled: true,
          label: (
            <Translate
              pt="Selecione"
              en="Select"
            />
          ),
        },
        ...contenders.map((contender) => ({
          value: contender.id,
          key: `option-${betTier}-${contender.id}`,
          label: `${translate(contender.name)} ${userContenders.includes(contender.id) ? translate({ pt: ' (Seu)', en: ' (Yours)' }) : ''}`,
        })),
      ]}
    />
  );
}
