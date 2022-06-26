import { Space } from 'antd';
// Components
import { AvatarIcon } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={state.outcome === 'WIN' ? 'trophy' : 'the-end'}
      rateWidgetCustomText={<Translate pt="Sugira palavras-secretas" en="Suggest secret words" />}
    >
      <Space className="space-container" direction="vertical" align="center">
        {state.outcome === 'WIN' ? (
          <>
            <AvatarIcon type="quality-seal" size={100} shape="square" />
            <Translate pt="VITÓRIA" en="WIN" />
          </>
        ) : (
          <>
            <AvatarIcon type="garbage" size={100} shape="square" />
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
