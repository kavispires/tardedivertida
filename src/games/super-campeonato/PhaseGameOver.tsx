// Ant Design resources
import { Divider, Space } from 'antd';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ContenderCard } from './components/ContenderCard';
import { useLanguage } from 'hooks/useLanguage';
import { Card } from 'components/cards';
import { Achievements } from 'components/general/Achievements';
import { achievementsReference } from './utils/achievements';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const pastBattles: PastBattles = state.pastBattles;
  const { translate } = useLanguage();

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Title size="xx-small" className="padding">
        <Translate pt="Campeão Ultimate" en="Ultimate Champion" />
      </Title>

      <Space className="space-container margin" align="center">
        <ContenderCard size={200} overlayColor="yellow" contender={state.finalWinner} />
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
                <ContenderCard
                  key={`${battle.challenge.id}-${contender.id}`}
                  size={80}
                  overlayColor={index === 0 ? 'yellow' : 'gray'}
                  contender={contender}
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

export default PhaseGameOver;
