// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TheEndIcon } from '@icons/TheEndIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
import { Title } from '@components/text/Title';
// Internal
import { STATUS } from './utils/constants';
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { Board } from './components/Board';
import { SummaryBox } from './components/SummaryBox';
import { History } from './components/History';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TheEndIcon />}
    >
      <SpaceContainer vertical>
        {state.status === STATUS.WIN && (
          <>
            <Title level={3}>
              <Translate
                pt="Vocês venceram!"
                en="You won!"
              />
            </Title>
            <Surface contained>
              <Translate
                pt="Vocês comunicaram todos os items"
                en="You communicated all items"
              />
            </Surface>
          </>
        )}
        {state.status === STATUS.LOSE && (
          <>
            <Title level={3}>
              <Translate
                pt="Vocês perderam!"
                en="You lost!"
              />
            </Title>
            <Surface contained>
              <Translate
                pt="Alguém clicou em  um tabu"
                en="Someone selected a taboo"
              />
            </Surface>
          </>
        )}
        {state.status === STATUS.CONTINUE && (
          <>
            <Title level={3}>
              <Translate
                pt="Vocês perderam!"
                en="You lost!"
              />
            </Title>
            <Surface contained>
              <Translate
                pt="As rodadas acabaram antes que vocês comunicassem todos os itens"
                en="The rounds ended before you communicated all items"
              />
            </Surface>
          </>
        )}
      </SpaceContainer>

      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Flex
        gap={8}
        align="center"
      >
        <Board
          deck={state.deck}
          deckType={state.deckType}
          userId={user.id}
          userSide={user.side}
        />
        <SummaryBox
          summary={state.summary}
          players={players}
          round={state.round}
        />
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
