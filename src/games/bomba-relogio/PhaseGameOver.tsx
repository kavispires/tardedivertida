import { useMemo } from 'react';
// Ant Design Resources
import { Switch } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { BombIcon } from 'icons/BombIcon';
import { CrownIcon } from 'icons/CrownIcon';
import { SecurityIcon } from 'icons/SecurityIcon';
import { TraitorIcon } from 'icons/TraitorIcon';
// Components
import { IconAvatar, PlayerAvatarCard } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Instruction } from 'components/text/Instruction';
import { ConfettiEffect } from 'components/visual-effects/ConfettiEffect';
// Internal
import { achievementsReference } from './utils/achievements';
import type { DataCounts, PhaseGameOverState, Status } from './utils/types';
import { OUTCOME, ROLE_IMAGES_NAMES } from './utils/constants';
import { useNotesStore } from './utils/notes-store';
import { AgentHighlight, RedWireHighlight, TerroristHighlight } from './components/Highlights';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const playersList = useMemo(() => sortPlayers(players), [players]);
  const { notes, setPlayerNote } = useNotesStore();

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<CrownIcon />}
    >
      {getResolution(state.status, state.dataCounts)}
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            en="Roles"
            pt="Funções"
          />
        }
        contentProps={{ className: 'final-gallery' }}
      >
        {playersList.map((player) => (
          <PlayerAvatarCard
            key={player.id}
            player={player}
            withName
          >
            <ImageCard
              cardWidth={64}
              cardId={ROLE_IMAGES_NAMES?.[player.role ?? 'agent']}
              type="square"
            />
            <Instruction>
              {player.role === 'terrorist' ? (
                <TerroristHighlight>
                  <Translate
                    en="Terrorist"
                    pt="Terrorista"
                  />
                </TerroristHighlight>
              ) : (
                <AgentHighlight>
                  <Translate
                    en="Agent"
                    pt="Agente"
                  />
                </AgentHighlight>
              )}
            </Instruction>
            <Switch
              value={notes[player.id] === 'terrorist'}
              styles={{
                root: { backgroundColor: notes[player.id] === 'terrorist' ? 'red' : 'green' },
              }}
              onChange={(checked) => setPlayerNote(player.id, checked ? 'terrorist' : 'agent')}
              checkedChildren={
                <IconAvatar
                  icon={<TraitorIcon />}
                  size="small"
                />
              }
              unCheckedChildren={
                <IconAvatar
                  icon={<SecurityIcon />}
                  size="small"
                />
              }
            />
          </PlayerAvatarCard>
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}

const getResolution = (status: Status, dataCounts: DataCounts) => {
  switch (status.outcome) {
    case OUTCOME.AGENTS_WIN: {
      return (
        <Instruction contained>
          <IconAvatar
            icon={<SecurityIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              pt={
                <>
                  Os agentes cortaram todos os{' '}
                  <RedWireHighlight>{dataCounts?.wires} fios vermelhos</RedWireHighlight>!<br />
                  Parabéns agentes, o mundo está salvo!
                </>
              }
              en={
                <>
                  The agents cut all the <RedWireHighlight>{dataCounts?.wires} red wires</RedWireHighlight>!
                  <br />
                  Congratulations agents, the world is safe!
                </>
              }
            />
          </strong>
          <ConfettiEffect />
        </Instruction>
      );
    }
    case OUTCOME.TERRORISTS_WIN: {
      return (
        <Instruction contained>
          <IconAvatar
            icon={<TraitorIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              pt={
                <>
                  Os agentes contaram apenas{' '}
                  <RedWireHighlight>{status.revealed} fios vermelhos</RedWireHighlight>...
                  <br />
                  Foi só uma questão de tempo até a bomba explodir... Os Terroristas vencem!
                </>
              }
              en={
                <>
                  The agents cut only <RedWireHighlight>{status.revealed} red wires</RedWireHighlight>...
                  <br />
                  It was just a matter of time until the bomb exploded... The Terrorists win!
                </>
              }
            />
          </strong>
        </Instruction>
      );
    }
    case OUTCOME.BOMB: {
      return (
        <Instruction contained>
          <IconAvatar
            icon={<BombIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              pt={
                <>
                  Cabum!!! Um agente cortou a bomba!!! Todo mundo morreu!
                  <br />
                  Os Terroristas vencem, mesmo mortos, porque o que importa é a causa!
                </>
              }
              en={
                <>
                  Kaboom!!! An agent cut the bomb! Everybody is dead!
                  <br />
                  The Terrorists win, even though everybody is dead, the cause has won!
                </>
              }
            />
          </strong>
          <ConfettiEffect />
        </Instruction>
      );
    }
    default: {
      return 'ERROR';
    }
  }
};
