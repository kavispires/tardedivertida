// Ant Design Resources
import { Avatar } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { SpecialRule } from '@components/text/SpecialRule';

type RoundTypeProps = {
  roundType: string;
};

const POSITIONS: Dictionary<number> = {
  CURSED_FIRST_POSITION: 1,
  SECOND_POSITION: 2,
  CENTER_POSITION: 3,
  FOURTH_POSITION: 4,
  CURSED_LAST_POSITION: 5,
};

export function RoundTypeExplanation({ roundType }: RoundTypeProps) {
  if (['SECOND_POSITION', 'CENTER_POSITION', 'FOURTH_POSITION'].includes(roundType)) {
    return (
      <RuleInstruction type="event">
        <SpecialRule>
          <Translate
            pt="Nesta rodada, jogadores que <strong>acertarem</strong> o cenário da posição {position} ganham {points} ao invés de 1."
            en="This round, players who <strong>match</strong> the scenario in position {position} get {points} instead of 1."
            values={{
              position: <Avatar>{POSITIONS[roundType]}</Avatar>,
              points: <PointsHighlight value={3} />,
            }}
          />
        </SpecialRule>
      </RuleInstruction>
    );
  }

  if (['CURSED_FIRST_POSITION', 'CURSED_LAST_POSITION'].includes(roundType)) {
    return (
      <RuleInstruction type="event">
        <SpecialRule>
          <Translate
            pt="Nesta rodada, jogadores que <strong>errarem</strong> o cenário da posição {position} perdem {penalty}."
            en="This round, players who <strong>miss</strong> the scenario in position {position} lose {penalty}."
            values={{
              position: <Avatar>{POSITIONS[roundType]}</Avatar>,
              penalty: (
                <PointsHighlight
                  type="negative"
                  value={1}
                />
              ),
            }}
          />
        </SpecialRule>
      </RuleInstruction>
    );
  }

  return null;
}
