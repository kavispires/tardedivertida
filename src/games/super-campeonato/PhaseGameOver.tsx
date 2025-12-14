// Ant Design Resources
import { Divider, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
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
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Internal
import type { PastBattles } from './utils/type';
import { achievementsReference } from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const pastBattles: PastBattles = state.pastBattles;
  const { translate } = useLanguage();

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Title size="xx-small" className="padding">
        <Translate pt="Campeão Ultimate" en="Ultimate Champion" />
      </Title>

      <SpaceContainer className="margin">
        <CharacterCard size={200} overlayColor="yellow" character={state.finalWinner} />
      </SpaceContainer>

      <Divider />

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Divider />

      <Title size="xx-small" className="padding">
        <Translate pt="Resumo das Batalhas" en="Battles Summary" />
      </Title>

      <SpaceContainer className="margin">
        {pastBattles.map((battle) => {
          return (
            <Space orientation="vertical" key={battle.challenge.id} align="center" className="final-gallery">
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
      </SpaceContainer>
    </GameOverWrapper>
  );
}
