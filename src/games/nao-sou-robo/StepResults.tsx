import clsx from 'clsx';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Avatar, Flex, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { UseStep } from 'hooks/useStep';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
// Components
import { PlayerAvatar, IconAvatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { Robot, RobotGalleryEntry } from './utils/types';
import { CaptchaTopic } from './components/CaptchaTopic';
import { RobotResult } from './components/RobotResult';
import { FloatingPlayerStats } from './components/FloatingPlayerStats';
import { Summary } from './components/Summary';

type StepResultProps = {
  user: GamePlayer;
  players: GamePlayers;
  result: RobotGalleryEntry;
  goToNextStep: UseStep['goToNextStep'];
  robot: Robot;
} & Pick<StepProps, 'announcement'>;

export function StepResult({ user, announcement, goToNextStep, players, result, robot }: StepResultProps) {
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle size="small">
        <Translate pt="Resultado" en="Results" />
      </StepTitle>

      <FloatingPlayerStats user={user} robot={robot} />

      <RobotResult result={result} robot={robot} />

      <Space wrap className="result-container">
        {result.options.map((option) => {
          return (
            <Flex
              vertical
              align="center"
              className={clsx('result', option.bot && 'result--bot')}
              key={option.id}
            >
              <Flex vertical justify="center" align="center">
                {option.bot ? (
                  <>
                    <IconAvatar icon={<RobotIcon />} size="large" />
                    <Translate pt="Robô" en="Robot" />
                  </>
                ) : (
                  <>
                    <IconAvatar icon={<SealOfApprovalIcon />} size="large" />
                    {option.playerId ? players[option.playerId].name : 'Player'}
                  </>
                )}
              </Flex>

              <ImageBlurButtonContainer cardId={option.id}>
                <ImageCard cardId={option.id} cardWidth={cardWidth} />
              </ImageBlurButtonContainer>

              <Avatar.Group max={{ count: 7 }}>
                {option.players.map((playerId) => (
                  <PlayerAvatar
                    avatarId={players[playerId].avatarId}
                    key={`votes-${option.id}-${players[playerId].avatarId}`}
                  />
                ))}
                {option.players.length === 0 && <PlayerAvatar avatarId="N" />}
              </Avatar.Group>
            </Flex>
          );
        })}
      </Space>

      <TitledContainer title={<Translate pt="Palavra-chave da Rodada" en="Round's keyword" />}>
        <CaptchaTopic captcha={result} />
      </TitledContainer>

      <Summary user={user} robot={robot} />

      <Flex justify="center">
        <TimedButton duration={45} onExpire={goToNextStep} onClick={goToNextStep} icon={<TrophyOutlined />}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Flex>
    </Step>
  );
}
