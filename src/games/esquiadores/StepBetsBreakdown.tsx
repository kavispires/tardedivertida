import clsx from 'clsx';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { LeftOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Icons
import { LodgeIcon } from 'icons/LodgeIcon';
import { QualitySealIcon } from 'icons/QualitySealIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Step } from 'components/steps';
import { StepTitle } from 'components/text';
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

  const playersList = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== skier.id),
        [(o) => (skier.skiersBets?.[o.id] ?? 0) + (skier.skiersBoost?.[o.id] ?? 0), 'name'],
        ['desc', 'asc'],
      ),
    [players, skier.id, skier.skiersBets, skier.skiersBoost],
  );

  return (
    <Step>
      <StepTitle>
        <Translate pt="Resumo das Apostas" en="Bets Summary" />
      </StepTitle>

      <div className="lodge-results">
        {orderedLodges.map((lodge) => (
          <div key={lodge.id} className="lodge-result">
            <div className="lodge-result__selected">
              <IconAvatar
                size="large"
                icon={<QualitySealIcon className={clsx(!lodge.selected && 'invisible')} />}
              />
            </div>
            <div className="lodge-result__lodge">
              <div className="lodge__icon">
                <LodgeIcon width={64} color={LODGE_COLORS[lodge.id]} />
                <span className="lodge__number">{lodge.id + 1}</span>
              </div>
            </div>
            <div className="lodge-result__players">
              {lodge.playersIds.map((playerId) => {
                const player = players[playerId];
                return (
                  <div key={playerId}>
                    <BettingChipValue value={player.bets?.[lodge.id] ?? 0} />
                    <AvatarName player={player} />
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
            <AvatarName player={skier} /> <Translate pt="Apostas do Esquiador" en=" the skier's Bets" />
          </Flex>
        }
        contentProps={{ className: 'contained' }}
      >
        {playersList.map((player) => {
          const betValue = (skier.skiersBets?.[player.id] ?? 0) + (skier.skiersBoost?.[player.id] ?? 0);
          return (
            <div key={player.id} className="lodge">
              <div className="lodge__icon">
                <AvatarName player={player} />
              </div>

              <div className="lodge__bets">
                <div className="lodge__bet">
                  <BettingChipValue value={betValue} />
                </div>
              </div>
            </div>
          );
        })}
      </TitledContainer>

      <SpaceContainer>
        <Button icon={<LeftOutlined />} onClick={goToPreviousStep}>
          <Translate pt="Ver Montanha" en="See Mountain" />
        </Button>
        <TimedButton duration={25} onExpire={goToNextStep} onClick={goToNextStep} icon={<TrophyOutlined />}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
