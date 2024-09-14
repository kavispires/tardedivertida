import clsx from 'clsx';
// Ant Design Resources
import { Avatar as AntAvatar, Flex, Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { UseStep } from 'hooks/useStep';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Title } from 'components/text';
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
      <Title size="small">
        <Translate pt="Resultado" en="Results" />
      </Title>

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
                <ImageCard id={option.id} cardWidth={cardWidth} />
              </ImageBlurButtonContainer>

              <AntAvatar.Group maxCount={7}>
                {option.players.map((playerId) => (
                  <Avatar
                    id={players[playerId].avatarId}
                    key={`votes-${option.id}-${players[playerId].avatarId}`}
                  />
                ))}
              </AntAvatar.Group>
            </Flex>
          );
        })}
      </Space>

      <Flex justify="center" className="margin">
        <CaptchaTopic captcha={result} />
      </Flex>

      <Summary user={user} robot={robot} />

      <Flex justify="center">
        <TimedButton duration={45} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Flex>
    </Step>
  );
}
