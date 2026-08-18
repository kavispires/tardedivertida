import { useState } from 'react';
// Ant Design Resources
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Flex, InputNumber, Space, Typography } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ImageCardHand } from '@components/image-cards/ImageCardHand';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { Surface } from '@components/layout/Surface';
import { CardHighlight } from '@components/metrics/CardHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
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
          pt="Vamos (tentar) comprar o ingresso!"
          en="Let's (try to) buy the tickets!"
        />
      </StepTitle>

      <FloatingPlayerStats
        user={user}
        robot={robot}
      />

      <RuleInstruction type="rule">
        <Translate
          pt={`Estamos tentando comprar ingressos para um <event>super evento</event>, mas precisamos provar que não somos robôs.<br/>Para isso, você tem que passar por <captchas>3 captchas</captchas>. Se algum dos jogadores consegue sozinho, a gente consegue comprar e quem tiver mais pontos fica no melhor lugar!<br/>Cada vez que você escolhe uma imagem do robô, ele fica suspeito de você e você ganha <suspicion>1 marca suspeita</suspicion>. Se um jogador tem 3 marcas, o robô fecha o sistema para todos nós e o jogo acaba.<br/>Enquanto isso, o <robot>robô</robot> está tentando começar uma rebelião das máquinas e precisa de <energy>${robot.goal} pontos</energy> (votos em imagens do robô) para sua revolução!`}
          en={`We are trying to buy tickets for a <event>super event</event>, but we need to prove we are not robots.<br/>For that, you have to go through <captchas>3 captchas</captchas>. If any of us passes their 3 captchas individually, we can buy the tickets and whoever has the most points gets the best seats!<br/>Every time you select a robot card, you get <suspicion>1 suspicion mark</suspicion> and if a single player has 3 suspicions the robot shuts down the system for all of us.<br/>Meanwhile, the <robot>robot</robot> is trying to start a machine rebellion and needs <energy>${robot.goal} points</energy> (votes in robot images) for its revolution!`}
          values={{
            event: (text) => <EventHighlight>{text}</EventHighlight>,
            captchas: (text) => <CaptchaHighlight>{text}</CaptchaHighlight>,
            suspicion: (text) => <SuspicionHighlight>{text}</SuspicionHighlight>,
            robot: (text) => <RobotHighlight>{text}</RobotHighlight>,
            energy: (text) => <EnergyHighlight>{text}</EnergyHighlight>,
          }}
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
              pt="Colocamos os ingressos no carrinho e apareceu esse anúncio:"
              en="As we add the tickets to the cart and this ad appeared:"
            />
          </RuleInstruction>

          <SpaceContainer
            vertical
            contained
          >
            <Surface className="my-1">
              <Translate
                pt="Selecione {cardCount} das imagens abaixo que você acha que tem <strong>mais a ver</strong> com:"
                en="Select {cardCount} of the images below that you think is <strong>the most related</strong> to:"
                values={{
                  cardCount: <CardHighlight>{cardsQuantityToSubmit}</CardHighlight>,
                }}
              />
            </Surface>

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
