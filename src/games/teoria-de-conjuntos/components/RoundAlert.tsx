// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';

export function RoundAlert({ round }: { round: GameRound }) {
  const roundsLeft = round.total - round.current + 1;
  if (roundsLeft > 5) {
    return <></>;
  }

  return (
    <RuleInstruction type="alert">
      <Translate
        en={<>There are only {roundsLeft} rounds left!</>}
        pt={<>Restam apenas {roundsLeft} rodadas!</>}
      />
      <Tooltip
        title={
          <Translate
            en="A round is over when a player places a thing in the wrong area"
            pt="Uma rodada acaba quando um jogador coloca uma coisa na área errada"
          />
        }
      >
        <Button type="text" shape="circle" icon={<InfoCircleOutlined />} size="small" />
      </Tooltip>
    </RuleInstruction>
  );
}
