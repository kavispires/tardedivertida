import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { LeftOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Icons
import { LodgeIcon } from 'icons/LodgeIcon';
import { QualitySealIcon } from 'icons/QualitySealIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TimedButton } from 'components/buttons/TimedButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { Step } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Lodge } from './utils/types';
import { LODGE_COLORS } from './utils/constants';
import { BettingChipValue } from './components/BettingChipValue';

type StepBetsBreakdownProps = {
  players: GamePlayers;
  skier: GamePlayer;
  lodges: Lodge[];
  goToNextStep: UseStep['goToNextStep'];
  goToPreviousStep: UseStep['goToPreviousStep'];
};

export function StepBetsBreakdown({
  players,
  skier,
  lodges,
  goToNextStep,
  goToPreviousStep,
}: StepBetsBreakdownProps) {
  const orderedLodges = useMemo(() => {
    return orderBy(lodges, ['selected', (o) => o.playersIds.length, 'id'], ['desc', 'desc', 'asc']);
  }, [lodges]);

  return (
    <Step>
      <StepTitle>
        <Translate
          pt="Resumo das Apostas"
          en="Bets Summary"
        />
      </StepTitle>

      <div className="lodge-results">
        {orderedLodges.map((lodge) => (
          <div
            key={lodge.id}
            className="lodge-result"
          >
            <div className="lodge-result__selected">
              <IconAvatar
                size="large"
                icon={<QualitySealIcon className={clsx(!lodge.selected && 'invisible')} />}
              />
            </div>
            <div className="lodge-result__lodge">
              <div className="lodge__icon">
                <LodgeIcon
                  width={64}
                  color={LODGE_COLORS[lodge.id]}
                />
                <span className="lodge__number">{lodge.id + 1}</span>
              </div>
            </div>
            <div className="lodge-result__players">
              {lodge.playersIds.map((playerId) => {
                const player = players[playerId];
                return (
                  <div key={playerId}>
                    <BettingChipValue value={player.bets?.[lodge.id] ?? 0} />
                    <PlayerAvatarName player={player} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <TitledContainer
        title={
          <Flex>
            <PlayerAvatarName player={skier} />{' '}
            <Translate
              pt="Apostas do Esquiador"
              en=" the skier's Bets"
            />
          </Flex>
        }
        contentProps={{ className: 'contained' }}
      >
        <div className="skier-bets">
          {lodges.map((lodge) => {
            const betValue = (skier.skiersBets?.[lodge.id] ?? 0) + (skier.skiersBoost?.[lodge.id] ?? 0);
            return (
              <div
                key={lodge.id}
                className="lodge"
              >
                <div className="lodge__icon">
                  <LodgeIcon
                    width={48}
                    color={LODGE_COLORS[lodge.id]}
                  />
                  <span className="lodge__number">{lodge.id + 1}</span>
                </div>

                <div className="lodge__bets">
                  <div className="lodge__bet">
                    <BettingChipValue value={betValue} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </TitledContainer>

      <SpaceContainer>
        <Button
          icon={<LeftOutlined />}
          onClick={goToPreviousStep}
        >
          <Translate
            pt="Ver Montanha"
            en="See Mountain"
          />
        </Button>
        <TimedButton
          duration={25}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
