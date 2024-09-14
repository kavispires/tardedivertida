// Ant Design Resources
import { Divider, Space } from 'antd';
// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { Card } from 'components/cards';
import { CharacterCard } from 'components/cards/CharacterCard';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { PastBattles } from './utils/type';
import { achievementsReference } from './utils/achievements';
// Ant Design resources

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const pastBattles: PastBattles = state.pastBattles;
  const { translate } = useLanguage();

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Title size="xx-small" className="padding">
        <Translate pt="Campeão Ultimate" en="Ultimate Champion" />
      </Title>

      <Space className="space-container margin" align="center">
        <CharacterCard size={200} overlayColor="yellow" character={state.finalWinner} />
      </Space>

      <Divider />

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Divider />

      <Title size="xx-small" className="padding">
        <Translate pt="Resumo das Batalhas" en="Battles Summary" />
      </Title>

      <Space className="space-container margin" align="center">
        {pastBattles.map((battle) => {
          return (
            <Space direction="vertical" key={battle.challenge.id} align="center" className="final-gallery">
              <Card header={translate('Desafio', 'Challenge')} color="purple" className="final-gallery__card">
                {battle.challenge.text}
              </Card>
              {battle.contenders.map((contender, index) => (
                <CharacterCard
                  key={`${battle.challenge.id}-${contender.id}`}
                  size={80}
                  overlayColor={index === 0 ? 'yellow' : 'gray'}
                  character={contender}
                  className="final-gallery__contender"
                />
              ))}
            </Space>
          );
        })}
      </Space>
    </GameOverWrapper>
  );
}
