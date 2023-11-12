import { useState } from 'react';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ImageCardHand } from 'components/image-cards';
import { CaptchaTopic } from './components/CaptchaTopic';
import { Button, Flex, InputNumber, Space, Typography } from 'antd';
import {
  CaptchaHighlight,
  EnergyHighlight,
  EventHighlight,
  RobotHighlight,
  SuspicionHighlight,
} from './components/Highlights';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getAnimationClass } from 'utils/helpers';
import { useMock } from 'hooks/useMock';
import { mockCardPick } from './utils/mock';
import { FloatingPlayerStats } from './components/FloatingPlayerStats';
import { Summary } from './components/Summary';

type StepSelectCardProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitCard: (payload: SubmitRobotCardPayload) => void;
  captcha: Captcha;
  robot: Robot;
} & AnnouncementProps;

export function StepSelectCard({
  user,
  announcement,
  onSubmitCard,
  captcha,
  players,
  robot,
}: StepSelectCardProps) {
  const { isLoading } = useLoading();
  const [areTicketsInCart, setAreTicketsInCart] = useState(false);

  const onSelectCard = (cardId: string) => onSubmitCard({ cardId });
  const playerCount = Object.keys(players).length;

  useMock(() => onSubmitCard({ cardId: mockCardPick(user.hand) }));

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
        <Translate pt={<>Vamos (tentar) comprar o ingresso!</>} en={<>Let's (try to) buy the tickets!</>} />
      </Title>

      <FloatingPlayerStats user={user} robot={robot} />

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Estamos tentando comprar ingressos para um <EventHighlight>super evento</EventHighlight>, mas
              precisamos provar que não somos robôs.
              <br />
              Para isso, você tem que passar por <CaptchaHighlight>3 captchas</CaptchaHighlight>. Se algum dos
              jogadores consegue, a gente consegue comprar e quem tiver mais pontos fica no melhor lugar!
              <br />
              Cada vez que você escolhe uma imagem do robô, ele fica suspeito de você e você ganha{' '}
              <SuspicionHighlight>1 marca suspeita</SuspicionHighlight>. Com 3 marcas, o robô fecha o sistema
              para todos nós e o jogo acaba.
              <br />
              Enquanto isso, o <RobotHighlight>robô</RobotHighlight> está tentando começar uma rebelião das
              máquinas e precisa de <EnergyHighlight>{robot.goal} pontos</EnergyHighlight> (votos em imagens
              do robô) para sua revolução!
            </>
          }
          en={
            <>
              We are trying to buy tickets for a <EventHighlight>super event</EventHighlight>, but we need to
              prove we are not robots.
              <br />
              For that, you have to go through <CaptchaHighlight>3 captchas</CaptchaHighlight>. If any of us
              passes, we can buy the tickets and whoever has the most points gets the best seats!
              <br />
              Every time you win a captcha, you get <SuspicionHighlight>
                1 suspicion mark
              </SuspicionHighlight>{' '}
              and if you have 3 the robot closes the system for all of us.
              <br />
              Meanwhile, the <RobotHighlight>robot</RobotHighlight> is trying to start a machine rebellion and
              needs <EnergyHighlight>{robot.goal} points</EnergyHighlight> (votes in robot images) for its
              revolution!
            </>
          }
        />
      </RuleInstruction>

      <Summary user={user} robot={robot} />

      {areTicketsInCart ? (
        <Flex vertical className={getAnimationClass('fadeIn')} align="center">
          <RuleInstruction type="event" className={getAnimationClass('tada')}>
            <Translate
              pt={<>Colocamos os ingressos no carrinho e apareceu esse anúncio:</>}
              en={<>As we add the tickets to the cart and this ad appeared:</>}
            />
          </RuleInstruction>

          <Space direction="vertical" className="space-container contained">
            <Flex justify="center">
              <CaptchaTopic captcha={captcha} />
            </Flex>

            <Instruction>
              <Translate
                pt={
                  <>
                    Selecione uma das imagens abaixo que você acha que tem <strong>mais a ver</strong> com a
                    carta acima.
                  </>
                }
                en={
                  <>
                    Select one of the images below that you think is <strong>the most related</strong> to the
                    card above.
                  </>
                }
              />
            </Instruction>

            <ImageCardHand
              hand={user.hand}
              onSelectCard={onSelectCard}
              disabledSelectButton={isLoading}
              sizeRatio={user.hand?.length}
              className="hand"
            />
          </Space>
        </Flex>
      ) : (
        <Space direction="vertical" className="contained">
          <Space className="space-container">
            <Typography.Text strong>
              <Translate pt="Ingressos" en="Tickets" />{' '}
            </Typography.Text>
            <InputNumber value={playerCount} readOnly width="30px" />
            <Button
              loading={isLoading}
              onClick={() => setAreTicketsInCart(true)}
              type="primary"
              icon={<ShoppingCartOutlined />}
            >
              <Translate pt="Adicionar ao carrinho" en="Add tickets to cart" />
            </Button>
          </Space>
        </Space>
      )}
    </Step>
  );
}
