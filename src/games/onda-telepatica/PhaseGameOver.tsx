// Ant Design Resources
import { Divider, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
import { WavelengthDeviceIcon } from 'icons/WavelengthDeviceIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import { achievementsReference } from './utils/achievements';

export function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
      rateWidgetCustomText={
        <Translate
          pt="Alguma sugestão de cartas com ideias opostas?"
          en="Any two-opposing ideas suggestions?"
        />
      }
    >
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Divider />

      {Boolean(state.pastCategories) && (
        <>
          <Title size="x-small" level={3}>
            <Translate pt="Galeria" en="Gallery" />
          </Title>

          <Space wrap align="center" className="o-past-category">
            {state.pastCategories.map((category: any) => {
              return (
                <div key={category.id} className="o-past-category-entry">
                  <IconAvatar icon={<WavelengthDeviceIcon />} size={48} />
                  <header className="o-past-category-entry__category">
                    {category.target < 0 && category.left}
                    {category.target > 0 && category.right}
                    {category.target === 0 && `${category.left}-${category.right}`}
                    <div className="o-past-category-entry__number">{Math.abs(category.target)}</div>
                  </header>
                  <div className="o-past-category-entry__clue">{category.clue}</div>
                  <div className="o-past-category-entry__author">
                    by {players?.[category.psychicId]?.name ?? '?'}
                  </div>
                </div>
              );
            })}
          </Space>
        </>
      )}
    </GameOverWrapper>
  );
}
