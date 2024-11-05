import clsx from 'clsx';
import { Region } from 'pages/Daily/components/Region';
import { useMemo } from 'react';
// Ant Design Resources
import { ArrowRightOutlined, BarChartOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Layout, Modal, Space, Typography } from 'antd';
// Types
import { Me } from 'types/user';
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
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import { DailyComunicacaoAlienigenaEntry } from '../utils/types';
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
  const initialState = useMemo(() => getInitialState(data), []); // eslint-disable-line react-hooks/exhaustive-deps
  const {
    hearts,
    selection,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    onItemClick,
    isReady,
    submitGuess,
    latestAttempt,
    guesses,
  } = useComunicacaoAlienigenaEngine(data, initialState);
  const width = useCardWidth(7, { margin: 64, maxWidth: 75, minWidth: 55 });

  const shouldShakeScreen = latestAttempt && !isComplete;

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
            {data.requests.map((request, index) => (
              <Flex
                vertical
                className="alien-requests__request"
                key={request.itemId}
                align="center"
                justify="flex-start"
              >
                <Avatar className="mb-2">{index + 1}</Avatar>
                <Flex vertical className="alien-requests__attributes" align="center">
                  <SignCard id={request.spritesIds[2]} width={width - 12} className="alien-requests__sign" />
                  <SignCard id={request.spritesIds[1]} width={width - 12} className="alien-requests__sign" />
                  <SignCard id={request.spritesIds[0]} width={width - 12} className="alien-requests__sign" />
                </Flex>

                {selection[index] ? (
                  <TransparentButton
                    onClick={() => onItemClick(selection[index]!)}
                    className="mt-1"
                    disabled={isComplete}
                  >
                    <ItemCard id={selection[index]!} width={isLose ? width / 2 : width} padding={0} />
                  </TransparentButton>
                ) : (
                  <Avatar shape="square" size="large" className="mt-1">
                    ?
                  </Avatar>
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
            ))}
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
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <Region>
          <Typography.Text strong>
            <Translate pt="Entregue essas coisas:" en="Deliver these things:" />
          </Typography.Text>

          <Space>
            {data.itemsIds.map((itemId, index) => (
              <TransparentButton
                key={itemId}
                onClick={() => onItemClick(itemId)}
                disabled={isReady || selection.includes(itemId)}
                className="alien-items__item-button"
              >
                <ItemCard id={itemId} width={width} padding={0} />
              </TransparentButton>
            ))}
          </Space>
        </Region>

        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            hearts={hearts}
            guesses={guesses}
            attributes={data.attributes}
            solution={data.answer}
            width={width}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
