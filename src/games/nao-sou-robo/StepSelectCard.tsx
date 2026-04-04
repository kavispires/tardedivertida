import { useState } from 'react';
// Ant Design Resources
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, InputNumber, Space, Typography } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { ImageCardHand } from 'components/image-cards/ImageCardHand';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { Step, type StepProps } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Captcha, Robot, SubmitRobotCardsPayload } from './utils/types';
import { mockCardPicks } from './utils/mock';
import { CaptchaTopic } from './components/CaptchaTopic';
import { FloatingPlayerStats } from './components/FloatingPlayerStats';
import { Summary } from './components/Summary';
import {
  CaptchaHighlight,
  EnergyHighlight,
  EventHighlight,
  RobotHighlight,
  SuspicionHighlight,
} from './components/Highlights';

type StepSelectCardProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitCard: (payload: SubmitRobotCardsPayload) => void;
  captcha: Captcha;
  robot: Robot;
  cardsQuantityToSubmit: number;
} & Pick<StepProps, 'announcement'>;

export function StepSelectCard({
  user,
  announcement,
  onSubmitCard,
  captcha,
  players,
  robot,
  cardsQuantityToSubmit,
}: StepSelectCardProps) {
  const { isLoading } = useLoading();
  const [areTicketsInCart, setAreTicketsInCart] = useState(false);
  const { dict: selections, updateDict: select, length: totalSelections } = useBooleanDictionary({});

  // const handleCardSelect = (cardId: UID) => {
  //   if (selectedCards.includes(cardId)) {
  //     setSelectedCards((prev) => prev.filter((id) => id !== cardId));
  //   } else if (selectedCards.length < cardsQuantityToSubmit) {
  //     setSelectedCards((prev) => [...prev, cardId]);
  //   }
  // };

  const playerCount = Object.keys(players).length;

  useMock(() => onSubmitCard({ cardIds: mockCardPicks(user.hand, cardsQuantityToSubmit) }));

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle size="small">
        <Translate
          pt={<>Vamos (tentar) comprar o ingresso!</>}
          en={<>Let's (try to) buy the tickets!</>}
        />
      </StepTitle>

      <FloatingPlayerStats
        user={user}
        robot={robot}
      />

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Estamos tentando comprar ingressos para um <EventHighlight>super evento</EventHighlight>, mas
              precisamos provar que não somos robôs.
              <br />
              Para isso, você tem que passar por <CaptchaHighlight>3 captchas</CaptchaHighlight>. Se algum dos
              jogadores consegue sozinho, a gente consegue comprar e quem tiver mais pontos fica no melhor
              lugar!
              <br />
              Cada vez que você escolhe uma imagem do robô, ele fica suspeito de você e você ganha{' '}
              <SuspicionHighlight>1 marca suspeita</SuspicionHighlight>. Se um jogador tem 3 marcas, o robô
              fecha o sistema para todos nós e o jogo acaba.
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
              passes their 3 captchas individually, we can buy the tickets and whoever has the most points
              gets the best seats!
              <br />
              Every time you select a robot card, you get{' '}
              <SuspicionHighlight>1 suspicion mark</SuspicionHighlight> and if a single player has 3
              suspicions the robot shuts down the system for all of us.
              <br />
              Meanwhile, the <RobotHighlight>robot</RobotHighlight> is trying to start a machine rebellion and
              needs <EnergyHighlight>{robot.goal} points</EnergyHighlight> (votes in robot images) for its
              revolution!
            </>
          }
        />
      </RuleInstruction>

      <Summary
        user={user}
        robot={robot}
      />

      {areTicketsInCart ? (
        <Flex
          vertical
          className={getAnimationClass('fadeIn')}
          align="center"
        >
          <RuleInstruction
            type="event"
            className={getAnimationClass('tada')}
          >
            <Translate
              pt={<>Colocamos os ingressos no carrinho e apareceu esse anúncio:</>}
              en={<>As we add the tickets to the cart and this ad appeared:</>}
            />
          </RuleInstruction>

          <SpaceContainer
            vertical
            contained
          >
            <Instruction className="my-1">
              <Translate
                pt={
                  <>
                    Selecione <CardHighlight>{cardsQuantityToSubmit}</CardHighlight> das imagens abaixo que
                    você acha que tem <strong>mais a ver</strong> com:
                  </>
                }
                en={
                  <>
                    Select <CardHighlight>{cardsQuantityToSubmit}</CardHighlight> of the images below that you
                    think is <strong>the most related</strong> to:
                  </>
                }
              />
            </Instruction>

            <Flex justify="center">
              <CaptchaTopic captcha={captcha} />
            </Flex>

            <ImageCardHand
              hand={user.hand}
              onSelectCard={select}
              disabledSelectButton={isLoading}
              sizeRatio={user.hand?.length}
              className="hand"
              selectedCards={selections}
            />

            <SpaceFloat enabled={totalSelections === cardsQuantityToSubmit}>
              <Badge
                count={totalSelections}
                color={totalSelections === cardsQuantityToSubmit ? 'blue' : 'red'}
              >
                <SendButton
                  size="large"
                  disabled={totalSelections !== cardsQuantityToSubmit}
                  onClick={() => onSubmitCard({ cardIds: Object.keys(selections) })}
                  loading={isLoading}
                >
                  <Translate
                    pt="Enviar escolhas"
                    en="Submit picks"
                  />
                </SendButton>
              </Badge>
            </SpaceFloat>
          </SpaceContainer>
        </Flex>
      ) : (
        <Space
          orientation="vertical"
          className="contained"
        >
          <SpaceContainer>
            <Typography.Text strong>
              <Translate
                pt="Ingressos"
                en="Tickets"
              />{' '}
            </Typography.Text>
            <InputNumber
              value={playerCount}
              readOnly
              width="30px"
            />
            <Button
              loading={isLoading}
              onClick={() => setAreTicketsInCart(true)}
              type="primary"
              icon={<ShoppingCartOutlined />}
            >
              <Translate
                pt="Adicionar ao carrinho"
                en="Add tickets to cart"
              />
            </Button>
          </SpaceContainer>
        </Space>
      )}
    </Step>
  );
}
