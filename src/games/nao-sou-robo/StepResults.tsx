// Ant Design Resources
import { Avatar as AntAvatar, Flex, Space } from 'antd';
// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { TimedButton } from 'components/buttons';
import { Avatar, IconAvatar } from 'components/avatars';
import { CaptchaTopic } from './components/CaptchaTopic';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { useCardWidth } from 'hooks/useCardWidth';
import { RobotIcon } from 'icons/RobotIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
import clsx from 'clsx';
import { RobotResult } from './components/RobotResult';
import { FloatingPlayerStats } from './components/FloatingPlayerStats';

type StepResultProps = {
  user: GamePlayer;
  players: GamePlayers;
  result: RobotGalleryEntry;
  goToNextStep: GenericFunction;

  robot: Robot;
} & AnnouncementProps;

export function StepResult({
  user,
  announcement,
  goToNextStep,
  players,
  result,

  robot,
}: StepResultProps) {
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
        <Translate pt="Resultado" en="Results" />
      </Title>

      <FloatingPlayerStats user={user} robot={robot} />

      <RobotResult players={players} result={result} robot={robot} />

      <Space wrap className="result-container">
        {result.options.map((option) => {
          return (
            <Flex
              vertical
              align="center"
              className={clsx('result', option.bot && 'result--bot')}
              key={option.id}
            >
              <Flex vertical justify="center">
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
                <ImageCard imageId={option.id} cardWidth={cardWidth} />
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

      <Flex justify="center">
        <TimedButton duration={30} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Flex>
    </Step>
  );
}
