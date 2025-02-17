import clsx from 'clsx';
import { Region } from 'pages/Daily/components/Region';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { ArrowRightOutlined, BarChartOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { DailyAlienGameIcon } from 'icons/DailyAlienGameIcon';
// Components
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyComunicacaoAlienigenaEntry } from '../utils/types';
import { useComunicacaoAlienigenaEngine } from '../utils/useComunicacaoAlienigenaEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyComunicacaoAlienigenaProps = {
  data: DailyComunicacaoAlienigenaEntry;
  currentUser: Me;
};

export function DailyComunicacaoAlienigena({ data }: DailyComunicacaoAlienigenaProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    selection,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onItemClick,
    onSlotClick,
    slotIndex,
    isReady,
    submitGuess,
    latestAttempt,
    guesses,
  } = useComunicacaoAlienigenaEngine(data, initialState);
  const width = useCardWidth(7, { margin: 64, maxWidth: 75, minWidth: 55 });

  const shouldShakeScreen = latestAttempt && !isComplete;

  const previousGuesses = useMemo(() => guesses.map((guess) => guess.split('-')), [guesses]);

  return (
    <Layout className="app">
      <Header icon={<DailyAlienGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules />}
        />

        <Region>
          <Typography.Text strong>
            <Translate pt="Atributos" en="Attributes" />
          </Typography.Text>

          <Space direction="vertical" className="alien-attributes">
            {data.attributes.map((attribute) => (
              <Flex className="alien-attributes__attribute" key={attribute.id} gap={8}>
                <SignCard id={attribute.spriteId} width={width} className="alien-attributes__sign" />
                <ArrowRightOutlined />
                <Flex className="alien-attributes__items">
                  {attribute.itemsIds.map((itemId) => (
                    <ItemCard
                      key={itemId}
                      id={itemId}
                      width={width - 12}
                      className="alien-attributes__item"
                      padding={0}
                    />
                  ))}
                </Flex>
              </Flex>
            ))}
          </Space>
        </Region>

        <Region key={latestAttempt} className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}>
          <Typography.Text strong>
            <Translate pt="Pedidos" en="Requests" />
          </Typography.Text>

          <Flex className="alien-requests" gap={8}>
            {data.requests.map((request, index) => {
              const selected = selection[index];
              return (
                <Flex
                  vertical
                  className="alien-requests__request"
                  key={request.itemId}
                  align="center"
                  justify="flex-start"
                >
                  <Avatar className="mb-2">{index + 1}</Avatar>
                  <Flex vertical className="alien-requests__attributes" align="center">
                    <SignCard
                      id={request.spritesIds[2]}
                      width={width - 12}
                      className="alien-requests__sign"
                    />
                    <SignCard
                      id={request.spritesIds[1]}
                      width={width - 12}
                      className="alien-requests__sign"
                    />
                    <SignCard
                      id={request.spritesIds[0]}
                      width={width - 12}
                      className="alien-requests__sign"
                    />
                  </Flex>

                  {selected ? (
                    <TransparentButton
                      onClick={() => onItemClick(selected)}
                      className="mt-1"
                      disabled={isComplete}
                    >
                      <ItemCard id={selected} width={isLose ? width / 2 : width} padding={0} />
                    </TransparentButton>
                  ) : (
                    <TransparentButton
                      onClick={() => onSlotClick(index)}
                      className="mt-3"
                      disabled={isComplete}
                      active={slotIndex === index}
                      activeClass="alien-request__slot--active"
                    >
                      <Avatar shape="square" size="large">
                        ?
                      </Avatar>
                    </TransparentButton>
                  )}

                  {isComplete && isLose && (
                    <ItemCard
                      id={request.itemId}
                      width={width}
                      padding={0}
                      className={clsx('alien-request__answer', getAnimationClass('zoomIn'))}
                    />
                  )}
                </Flex>
              );
            })}
          </Flex>

          {isReady && !isComplete && (
            <Region>
              <Button type="primary" onClick={submitGuess}>
                <Translate pt="Enviar" en="Submit" />
              </Button>
            </Region>
          )}
        </Region>

        {isComplete && (
          <Space className="results-container" direction="vertical" align="center" size="large">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <Region>
          <Typography.Text strong>
            <Translate pt="Entregue essas coisas:" en="Deliver these things:" />
          </Typography.Text>

          <SpaceContainer wrap>
            {data.itemsIds.map((itemId) => (
              <TransparentButton
                key={itemId}
                onClick={() => onItemClick(itemId)}
                disabled={isComplete || isReady || selection.includes(itemId)}
                className="alien-items__item-button"
              >
                <ItemCard id={itemId} width={width} padding={0} />
              </TransparentButton>
            ))}
          </SpaceContainer>
        </Region>

        {previousGuesses.length > 0 && (
          <Region>
            <Typography.Text strong>
              <Translate pt="Tentativas anteriores" en="Previous Guesses:" />
            </Typography.Text>
            <Space direction="vertical" className="previous-guesses">
              {previousGuesses.map((guess) => (
                <Space key={String(guess)}>
                  {guess.map((itemId) => (
                    <ItemCard
                      key={itemId}
                      id={itemId}
                      width={Math.max(width / 2, 40)}
                      padding={0}
                      className="alien-requests__previous-item"
                    />
                  ))}
                </Space>
              ))}
            </Space>
          </Region>
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            hearts={hearts}
            guesses={guesses}
            attributes={data.attributes}
            solution={data.solution}
            width={width}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
