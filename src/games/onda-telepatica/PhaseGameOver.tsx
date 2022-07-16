import { Space } from 'antd';
// Components
import { GameOverWrapper } from 'components/game-over';
import { IconAvatar } from 'components/icons/IconAvatar';
import { WavelengthDeviceIcon } from 'components/icons/WavelengthDeviceIcon';
import { Translate } from 'components/language';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon="trophy"
      rateWidgetCustomText={
        <Translate
          pt="Alguma sugestão de cartas com ideias opostas?"
          en="Any two-opposing ideas suggestions?"
        />
      }
    >
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
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
