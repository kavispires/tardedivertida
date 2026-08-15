// Ant Design Resources
import { Divider, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
import { WavelengthDeviceIcon } from '@icons/WavelengthDeviceIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
import { Title } from '@components/text/Title';
// Internal
import { achievementsReference } from './utils/achievements';
import type { CurrentCategory, PhaseGameOverState } from './utils/types';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
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
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Divider />

      {Boolean(state.pastCategories) && (
        <>
          <Title
            size="x-small"
            level={3}
          >
            <Translate
              pt="Galeria"
              en="Gallery"
            />
          </Title>

          <Space
            wrap
            align="center"
            className="o-past-category"
          >
            {state.pastCategories.map((category: CurrentCategory) => {
              const { target = 0, psychicId = '' } = category;
              return (
                <div
                  key={category.id}
                  className="o-past-category-entry"
                >
                  <Icon
                    icon={<WavelengthDeviceIcon />}
                    size={48}
                  />
                  <header className="o-past-category-entry__category">
                    {target < 0 && category.left}
                    {target > 0 && category.right}
                    {target === 0 && `${category.left}-${category.right}`}
                    <div className="o-past-category-entry__number">{Math.abs(target)}</div>
                  </header>
                  <div className="o-past-category-entry__clue">{category.clue}</div>
                  <div className="o-past-category-entry__author">by {players?.[psychicId]?.name ?? '?'}</div>
                </div>
              );
            })}
          </Space>
        </>
      )}
    </GameOverWrapper>
  );
}
