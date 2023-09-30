import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
// Components
import { Table } from './components/Table';
import { messageContent } from 'components/pop-up';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { ViewOr } from 'components/views';
import { IconAvatar } from 'components/avatars';
import { ImageCardHand } from 'components/image-cards';
import { FloatingHand } from 'components/general/FloatingHand';
import { TurnOrder } from 'components/players';
import { isEarliestPlayerWithFewestCards } from './utils/helpers';
import { TimedTimerClock } from 'components/timers';

type StepPlayCardActionProps = {
  isUserTheImpostor: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: DetetivesImaginativosCardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  isLoading: boolean;
  turnOrder: TurnOrder;
  leaderId: PlayerId;
};

export function StepPlayCardAction({
  isUserTheImpostor,
  clue,
  currentPlayer,
  table,
  players,
  user,
  onPlayCard,
  isLoading,
  turnOrder,
  leaderId,
}: StepPlayCardActionProps) {
  const { message } = App.useApp();
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();
  const onSelectCard = (cardId: string) => onPlayCard({ cardId });
  const [wasMessageDisplayed, setWasMessageDisplayed] = useState(false);

  useEffect(() => {
    if (!wasMessageDisplayed && !isLoading && isEarliestPlayerWithFewestCards(table, user.id, turnOrder)) {
      message.info(
        messageContent(
          translate('Escolha uma carta!', 'Choose a card to play'),
          translate(
            'Aperte o botão Selecionar acima da carta escolhida',
            'Press the select button above each card'
          ),

          currentPlayer.id,
          3
        )
      );
      setWasMessageDisplayed(true);
    }
  }, [
    wasMessageDisplayed,
    currentPlayer.id,
    translate,
    isLoading,
    user.updatedAt,
    table,
    user.id,
    turnOrder,
    message,
  ]);

  return (
    <>
      <Title>
        {isUserTheImpostor ? (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" />{' '}
            <TextHighlight>
              <QuestionCircleFilled />
            </TextHighlight>{' '}
            <Translate pt="Você é o impostor!" en="You are the impostor!" />
          </>
        ) : (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" /> <TextHighlight>{clue}</TextHighlight>
          </>
        )}
      </Title>

      <Instruction>
        <ViewOr condition={isUserTheImpostor}>
          <>
            <IconAvatar icon={<ImageCardsIcon />} size="large" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com as cartas que os outros
                jogadores estão usando."
              en="Select a card that best fits with what others are playing."
            />
          </>

          <>
            <IconAvatar icon={<ImageCardsIcon />} size="large" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com a pista secreta."
              en="Select a card that best fits the secret clue."
            />
          </>
        </ViewOr>
        <TimedTimerClock duration={75} onExpire={() => onSelectCard('back-default')} />
      </Instruction>

      <Table table={table} players={players} />

      <TurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
        reorderByUser={leaderId}
      />

      <FloatingHand>
        <ImageCardHand
          hand={user.hand}
          onSelectCard={onSelectCard}
          disabledSelectButton={isLoading}
          sizeRatio={user.hand?.length}
        />
      </FloatingHand>
    </>
  );
}
