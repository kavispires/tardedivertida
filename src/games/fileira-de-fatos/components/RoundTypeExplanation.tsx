// Ant Design Resources
import { Avatar } from 'antd';
// Components
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { RuleInstruction } from 'components/text';
import { SpecialRule } from 'components/text/SpecialRule';

type RoundTypeProps = {
  roundType: string;
};

const POSITIONS: NumberDictionary = {
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
            pt={
              <>
                Nesta rodada, jogadores que <strong>acertarem</strong> o cenário da posição{' '}
                <Avatar>{POSITIONS[roundType]}</Avatar> ganham <PointsHighlight>3 pontos</PointsHighlight> ao
                invés de 1.
              </>
            }
            en={
              <>
                This round, players who <strong>match</strong> the scenario in position{' '}
                <Avatar>{POSITIONS[roundType]}</Avatar> get <PointsHighlight>3 points</PointsHighlight>{' '}
                instead of 1.
              </>
            }
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
            pt={
              <>
                Nesta rodada, jogadores que <strong>errarem</strong> o cenário da posição{' '}
                <Avatar>{POSITIONS[roundType]}</Avatar> perdem{' '}
                <PointsHighlight type="negative">1 ponto</PointsHighlight> ao invés de 0.
              </>
            }
            en={
              <>
                This round, players who <strong>miss</strong> the scenario in position{' '}
                <Avatar>{POSITIONS[roundType]}</Avatar> lose{' '}
                <PointsHighlight type="negative">1 point</PointsHighlight> instead of 0.
              </>
            }
          />
        </SpecialRule>
      </RuleInstruction>
    );
  }

  return null;
}
