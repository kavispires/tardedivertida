import { useMemo } from 'react';
import clsx from 'clsx';
// Ant Design Resources
import { Button, Flex, Image } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { Captcha, CaptchaCard, Robot, SubmitRobotGuessPayload } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { mockGuess } from './utils/mock';
import { getAnimationClass, shuffle } from 'utils/helpers';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { CaptchaTopic } from './components/CaptchaTopic';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { IconAvatar } from 'components/avatars';
import { SpeechBubble } from 'components/text/SpeechBubble';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { FloatingPlayerStats } from './components/FloatingPlayerStats';
import { Summary } from './components/Summary';

type StepSelectAllProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitCaptcha: (payload: SubmitRobotGuessPayload) => void;
  captcha: Captcha;
  options: Dictionary<CaptchaCard>;
  robot: Robot;
} & Pick<StepProps, 'announcement'>;

export function StepSelectAll({
  players,
  user,
  announcement,
  onSubmitCaptcha,
  captcha,
  options,
  robot,
}: StepSelectAllProps) {
  const { isLoading } = useLoading();
  const { length, dict: selectedCards, updateDict: toggleCard, keys: selection } = useBooleanDictionary({});
  const cardWidth = useCardWidth(5, { gap: 8, minWidth: 140, maxWidth: 150 });

  const onSubmitCards = () => onSubmitCaptcha({ guess: selection });

  const shuffledOptions = useMemo(() => {
    return shuffle(Object.keys(options));
  }, [options]);

  const playerCount = Object.keys(players).length;

  useMock(() => onSubmitCaptcha({ guess: mockGuess(shuffledOptions, playerCount, user.cardId) }));

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
        <Translate pt={<>Você é um robô?</>} en={<>Are you a robot?</>} />
      </Title>

      <FloatingPlayerStats user={user} robot={robot} />

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              O sistema não está deixando você comprar! Você precisa provar que não é um cambista ordinário
              tentando fazer mutreta!
            </>
          }
          en={
            <>
              The system is not letting you buy! You need to prove that you are not an ordinary scalper trying
              to do a scam!
            </>
          }
        />
      </RuleInstruction>

      <div className="n-table-container">
        <div className="n-table-robot">
          <IconAvatar icon={<RobotIcon />} size={64} />
          <SpeechBubble style={{ width: '90%' }}>
            <Translate
              pt={
                <>
                  Selecione <strong>todas</strong> as imagens abaixo relacionadas com:{' '}
                </>
              }
              en={
                <>
                  Select <strong>all</strong> the images below related to:{' '}
                </>
              }
            />
            <Flex justify="center">
              <CaptchaTopic captcha={captcha} />
            </Flex>
          </SpeechBubble>
        </div>
        <Image.PreviewGroup>
          <ul className="n-table">
            {shuffledOptions.map((cardId, index) => {
              const isSelected = selectedCards[cardId];

              return (
                <li
                  key={`n-table-${cardId}`}
                  className={clsx(
                    'n-table-item',
                    getAnimationClass('flipInY', {
                      delay: index,
                    })
                  )}
                  style={{ width: `${cardWidth + 8}px` }}
                >
                  <ImageCardButton
                    id={cardId}
                    onClick={() => toggleCard(cardId)}
                    buttonPosition="bottom"
                    icon={isSelected ? <CloseCircleOutlined /> : undefined}
                    buttonText={
                      isSelected ? (
                        <Translate pt="Desmarcar" en="Deselect" />
                      ) : (
                        <Translate pt="Selecionar" en="Select" />
                      )
                    }
                  >
                    <ImageCard
                      id={cardId}
                      cardWidth={cardWidth - 6} // 6 is the border total size
                      square
                      className={clsx('n-table-image', isSelected && 'n-table-image--selected')}
                      preview={false}
                    />
                  </ImageCardButton>
                </li>
              );
            })}
          </ul>
        </Image.PreviewGroup>
      </div>

      <RuleInstruction type="event">
        <Translate
          pt={
            <>
              São <CardHighlight>{playerCount} cartas</CardHighlight> no total a serem selecionadas.
              <br />
              Você ganha <PointsHighlight type="positive">1 ponto</PointsHighlight> por cada carta que não é
              do robô e perde <PointsHighlight type="negative">1 ponto</PointsHighlight> por cada carta que é
              do robô.
            </>
          }
          en={
            <>
              There are <CardHighlight>{playerCount} cards</CardHighlight> in total to be selected.
              <br />
              You get <PointsHighlight type="positive">1 point</PointsHighlight> for each card that is not
              from the robot and lose <PointsHighlight type="negative">1 point</PointsHighlight> for each card
              that is from the robot.
            </>
          }
        />
      </RuleInstruction>

      <Flex justify="center">
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          onClick={onSubmitCards}
          disabled={user.ready || length !== playerCount}
        >
          <Translate pt="Enviar Captcha" en="Submit Captcha" />
        </Button>
      </Flex>

      <Summary user={user} robot={robot} />
    </Step>
  );
}
