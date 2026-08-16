// Ant Design Resources
import { Switch } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Icons
import { BombIcon } from '@icons/BombIcon';
import { FlagIcon } from '@icons/FlagIcon';
import { NuclearExplosionIcon } from '@icons/NuclearExplosionIcon';
import { PigeonIcon } from '@icons/PigeonIcon';
import { SecurityIcon } from '@icons/SecurityIcon';
import { SkullIcon } from '@icons/SkullIcon';
import { TraitorIcon } from '@icons/TraitorIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Icon } from '@components/general/Icon';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
import { ConfettiEffect } from '@components/visual-effects/ConfettiEffect';
// Internal
import { achievementsReference } from './utils/achievements';
import type { DataCounts, PhaseGameOverState, Status } from './utils/types';
import { OUTCOME, ROLE_IMAGES_NAMES } from './utils/constants';
import { useNotesStore } from './utils/useNotesStore';
import { AgentHighlight, RedWireHighlight, TerroristHighlight } from './components/Highlights';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const sortedPlayers = useSortedPlayers(players);
  const { notes, setPlayerNote } = useNotesStore();

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={getPhaseIcon(state.status)}
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
        {sortedPlayers.map((player) => (
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
            <Surface>
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
            </Surface>
            <Switch
              value={notes[player.id] === 'terrorist'}
              styles={{
                root: { backgroundColor: notes[player.id] === 'terrorist' ? 'red' : 'green' },
              }}
              onChange={(checked) => setPlayerNote(player.id, checked ? 'terrorist' : 'agent')}
              checkedChildren={
                <Icon
                  icon={<TraitorIcon />}
                  size="small"
                />
              }
              unCheckedChildren={
                <Icon
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

const getPhaseIcon = (status: Status) => {
  switch (status.outcome) {
    case OUTCOME.AGENTS_WIN:
      return <PigeonIcon />;
    case OUTCOME.TERRORISTS_WIN:
      return <SkullIcon />;
    case OUTCOME.BOMB:
      return <NuclearExplosionIcon />;
    default:
      return <FlagIcon />;
  }
};

const getResolution = (status: Status, dataCounts: DataCounts) => {
  switch (status.outcome) {
    case OUTCOME.AGENTS_WIN: {
      return (
        <Surface contained>
          <Icon
            icon={<SecurityIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              en="The agents cut all the <RedWireHighlight>red wires</RedWireHighlight>!<br />Congratulations agents, the world is safe!"
              pt="Os agentes cortaram todos os <RedWireHighlight>fios vermelhos</RedWireHighlight>!<br />Parabéns agentes, o mundo está salvo!"
              values={{
                RedWireHighlight: (text: string) => (
                  <RedWireHighlight>
                    {dataCounts?.wires} {text}
                  </RedWireHighlight>
                ),
              }}
            />
          </strong>
          <ConfettiEffect />
        </Surface>
      );
    }
    case OUTCOME.TERRORISTS_WIN: {
      return (
        <Surface contained>
          <Icon
            icon={<TraitorIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              en="The agents cut only <RedWireHighlight>red wires</RedWireHighlight>...<br />It was just a matter of time until the bomb exploded... The Terrorists win!"
              pt="Os agentes contaram apenas <RedWireHighlight>fios vermelhos</RedWireHighlight>...<br />Foi só uma questão de tempo até a bomba explodir... Os Terroristas vencem!"
              values={{
                RedWireHighlight: (text: string) => (
                  <RedWireHighlight>
                    {status?.revealed} {text}
                  </RedWireHighlight>
                ),
              }}
            />
          </strong>
        </Surface>
      );
    }
    case OUTCOME.BOMB: {
      return (
        <Surface contained>
          <Icon
            icon={<BombIcon />}
            size={64}
          />
          <br />
          <strong>
            <Translate
              en="Kaboom!!! An agent cut the bomb! Everybody is dead!<br />The Terrorists win, even though everybody is dead, the cause has won!"
              pt="Cabum!!! Um agente cortou a bomba!!! Todo mundo morreu!<br />Os Terroristas vencem, mesmo mortos, porque o que importa é a causa!"
            />
          </strong>
          <ConfettiEffect />
        </Surface>
      );
    }
    default: {
      return 'ERROR';
    }
  }
};
