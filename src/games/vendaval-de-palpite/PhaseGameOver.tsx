import { Space } from 'antd';
// Components
import { GameOverWrapper } from 'components/game-over';
import { GarbageIcon } from 'components/icons/GarbageIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { QualitySealIcon } from 'components/icons/QualitySealIcon';
import { TheEndIcon } from 'components/icons/TheEndIcon';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={state.outcome === 'WIN' ? <TrophyIcon /> : <TheEndIcon />}
      rateWidgetCustomText={<Translate pt="Sugira palavras-secretas" en="Suggest secret words" />}
    >
      <Space className="space-container" direction="vertical" align="center">
        {state.outcome === 'WIN' ? (
          <>
            <IconAvatar icon={<QualitySealIcon />} size={100} shape="square" />
            <Translate pt="VITÓRIA" en="WIN" />
          </>
        ) : (
          <>
            <IconAvatar icon={<GarbageIcon />} size={100} shape="square" />
            <Translate pt="DERROTA" en="LOSE" />
          </>
        )}
      </Space>
      <CategoryWordGroup categories={state.categories} secretWord={state.secretWord} showSecretWord />
      <Board players={players} clues={state.clues} board={state.board} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
