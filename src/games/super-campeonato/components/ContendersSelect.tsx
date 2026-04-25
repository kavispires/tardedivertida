// Ant Design Resources
import { Select } from 'antd';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import type { BracketTier, FightingContender } from '../utils/type';

type ContendersSelectProps = {
  contenders: FightingContender[];
  updateBet: (value: Dictionary<string>) => void;
  language: Language;
  betTier: BracketTier;
};

export function ContendersSelect({ contenders, updateBet, language, betTier }: ContendersSelectProps) {
  return (
    <Select
      className="w-bet-form__select"
      defaultValue=""
      onChange={(id) => updateBet({ [betTier]: id })}
      options={[
        {
          value: '',
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
          label: contender.name[language],
        })),
      ]}
    />
  );
}
