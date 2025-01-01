// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useUser } from 'hooks/useUser';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction, Title } from 'components/text';
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

      <SpaceContainer vertical>
        {state.status === STATUS.WIN && (
          <>
            <Title level={3}>
              <Translate pt="Vocês venceram!" en="You won!" />
            </Title>
            <Instruction contained>
              <Translate pt="Vocês comunicaram todos os items" en="You communicated all items" />
            </Instruction>
          </>
        )}
        {state.status === STATUS.LOSE && (
          <>
            <Title level={3}>
              <Translate pt="Vocês perderam!" en="You lost!" />
            </Title>
            <Instruction contained>
              <Translate pt="Alguém clicou em  um tabu" en="Someone selected a taboo" />
            </Instruction>
          </>
        )}
        {state.status === STATUS.CONTINUE && (
          <>
            <Title level={3}>
              <Translate pt="Vocês perderam!" en="You lost!" />
            </Title>
            <Instruction contained>
              <Translate
                pt="As rodadas acabaram antes que vocês comunicassem todos os itens"
                en="The rounds ended before you communicated all items"
              />
            </Instruction>
          </>
        )}
      </SpaceContainer>

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
