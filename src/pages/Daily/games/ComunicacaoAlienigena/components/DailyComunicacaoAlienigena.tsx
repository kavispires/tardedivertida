import clsx from 'clsx';
import { DailyItem } from 'pages/Daily/components/DailyItem';
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
import { DivButton } from 'components/buttons/DivButton';
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
import { RulesHints } from './RulesHints';

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
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text strong>
            <Translate
              pt="O alienígena entende que isso é aquilo:"
              en="The alien understands that this is that:"
            />
          </Typography.Text>

          <Space direction="vertical" className="alien-attributes">
            {data.attributes.map((attribute) => (
              <Flex className="alien-attributes__attribute" key={attribute.id} gap={8}>
                <SignCard signId={attribute.spriteId} width={width} className="alien-attributes__sign" />
                <ArrowRightOutlined />
                <Flex className="alien-attributes__items">
                  {attribute.itemsIds.map((itemId) => (
                    <DivButton key={itemId}>
                      <DailyItem
                        itemId={itemId}
                        width={width - 12}
                        className="alien-attributes__item"
                        padding={0}
                      />
                    </DivButton>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Space>
        </Region>

        {isComplete && (
          <Region>
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Region>
        )}

        <Region key={latestAttempt} className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}>
          <Typography.Text strong>
            <Translate pt="O alienígena quer isso:" en="The alien wants these:" />
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
                      signId={request.spritesIds[2]}
                      width={width - 12}
                      className="alien-requests__sign"
                    />
                    <SignCard
                      signId={request.spritesIds[1]}
                      width={width - 12}
                      className="alien-requests__sign"
                    />
                    <SignCard
                      signId={request.spritesIds[0]}
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
                      <DailyItem itemId={selected} width={isLose ? width / 2 : width} padding={0} />
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

                  {isComplete && (
                    <DailyItem
                      itemId={request.itemId}
                      width={width}
                      padding={6}
                      className={clsx('alien-request__answer mt-2', getAnimationClass('zoomIn'))}
                    />
                  )}
                </Flex>
              );
            })}
          </Flex>
          {isComplete && (
            <SpaceContainer direction="vertical">
              {previousGuesses.map((guess) => (
                <Space key={String(guess)}>
                  {guess.map((itemId) => (
                    <DailyItem
                      key={itemId}
                      itemId={itemId}
                      width={Math.max(width / 2, 40)}
                      padding={3}
                      className="alien-requests__previous-item mx-2"
                    />
                  ))}
                </Space>
              ))}
            </SpaceContainer>
          )}

          {isReady && !isComplete && (
            <Region>
              <Button type="primary" onClick={submitGuess}>
                <Translate pt="Enviar" en="Submit" />
              </Button>
            </Region>
          )}
        </Region>

        <Region>
          <Typography.Text strong>
            <Translate pt="E essas são as coisas disponíveis:" en="And these are the available things:" />
          </Typography.Text>

          <SpaceContainer wrap>
            {data.itemsIds.map((itemId) => (
              <TransparentButton
                key={itemId}
                onClick={() => onItemClick(itemId)}
                disabled={isComplete || isReady || selection.includes(itemId)}
                className="alien-items__item-button"
              >
                <DailyItem itemId={itemId} width={width} padding={0} />
              </TransparentButton>
            ))}
          </SpaceContainer>
        </Region>

        {!isComplete && previousGuesses.length > 0 && (
          <Region>
            <Typography.Text strong>
              <Translate pt="Tentativas anteriores" en="Previous Guesses:" />
            </Typography.Text>
            <Space direction="vertical" className="previous-guesses">
              {previousGuesses.map((guess) => (
                <Space key={String(guess)}>
                  {guess.map((itemId) => (
                    <DailyItem
                      key={itemId}
                      itemId={itemId}
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
            challengeNumber={data.number}
            win={isWin}
            guesses={guesses}
            hearts={hearts}
            attributes={data.attributes}
            requests={data.requests}
            solution={data.solution}
            width={width * 0.65}
          />
        </Modal>
      </Layout.Content>

      <Region>
        <RulesHints />
      </Region>
    </Layout>
  );
}
