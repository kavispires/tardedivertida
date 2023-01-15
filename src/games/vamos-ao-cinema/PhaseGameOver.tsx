// Components
import { Progress, Space } from 'antd';
import { GameOverWrapper } from 'components/game-over';
import { FlagIcon } from 'components/icons/FlagIcon';
import { Translate } from 'components/language';
import { Title } from 'components/text';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<FlagIcon />}>
      <Space className="space-container" direction="vertical">
        <Title size="xx-small">
          <Translate pt="Pontuação" en="Score" />
        </Title>

        <Progress type="circle" percent={Math.round((100 * state.groupScore) / 30)} />
      </Space>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
