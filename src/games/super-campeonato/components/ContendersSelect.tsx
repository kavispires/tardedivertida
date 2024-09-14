// Ant Design Resources
import { Select } from 'antd';
// Components
import { Translate } from 'components/language';
// Internal
import type { BracketTier, FightingContender } from '../utils/type';
// Ant Design resources

type ContendersSelectProps = {
  contenders: FightingContender[];
  updateBet: GenericFunction;
  language: Language;
  betTier: BracketTier;
};

export function ContendersSelect({ contenders, updateBet, language, betTier }: ContendersSelectProps) {
  return (
    <Select className="w-bet-form__select" defaultValue="" onChange={(id) => updateBet({ [betTier]: id })}>
      <Select.Option value="">
        <Translate pt="Selecione" en="Select" />
      </Select.Option>
      {contenders.map((contender) => (
        <Select.Option value={contender.id} key={`option-${betTier}-${contender.id}`}>
          {contender.name[language]}
        </Select.Option>
      ))}
    </Select>
  );
}
