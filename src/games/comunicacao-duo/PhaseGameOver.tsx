// Ant Design Resources
import { Flex, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Title } from 'components/text';
// Internal
import { STATUS } from './utils/constants';
import { Board } from './components/Board';
import { SummaryBox } from './components/SummaryBox';
import { History } from './components/History';
// Icons
// import { Achievements } from 'components/general/Achievements';
// Internal
// import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const user = useUser(players, state);

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TheEndIcon />}>
      {/* <Achievements players={players} achievements={state.achievements} reference={achievementsReference} /> */}

      <Space className="space-container">
        {state.status === STATUS.WIN ? (
          <Title level={3}>Vocês venceram!</Title>
        ) : (
          <Title level={3}>Vocês perderam!</Title>
        )}
      </Space>

      <Flex gap={8} align="center">
        <Board deck={state.deck} deckType={state.deckType} userId={user.id} userSide={user.side} />
        <SummaryBox summary={state.summary} players={players} round={state.round} />
      </Flex>

      <History
        history={state.history}
        players={players}
        deck={state.deck}
        deckType={state.deckType}
        clueInputType={state.clueInputType}
        userSide={user.side}
      />
    </GameOverWrapper>
  );
}
