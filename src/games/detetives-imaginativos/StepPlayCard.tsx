import { useEffect } from 'react';
// Ant Design Resources
import { message } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Table } from './components/Table';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Translate } from 'components/language';
import { ViewIf } from 'components/views';
import { AvatarName } from 'components/avatars';
import { FloatingHand, ImageCardHand } from 'components/cards';
import { TurnOrder } from 'components/players';
import { IconAvatar } from 'components/icons/IconAvatar';
import { ImageCardsIcon } from 'components/icons/ImageCardsIcon';
import { AnimatedClockIcon } from 'components/icons/AnimatedClockIcon';

type StepPlayCardProps = {
  isUserTheImpostor: boolean;
  isUserTheCurrentPlayer: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: DetetivesImaginativosCardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  onPlayCard: GenericFunction;
  isLoading: boolean;
  turnOrder: TurnOrder;
};

export function StepPlayCard({
  isUserTheImpostor,
  isUserTheCurrentPlayer,
  clue,
  currentPlayer,
  table,
  players,
  user,
  onPlayCard,
  isLoading,
  turnOrder,
}: StepPlayCardProps) {
  const { translate } = useLanguage();
  const onSelectCard = (cardId: string) => onPlayCard({ cardId });

  useEffect(() => {
    if (isUserTheCurrentPlayer && !isLoading) {
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
    }
  }, [isUserTheCurrentPlayer, currentPlayer.id, translate, isLoading]);

  return (
    <Step key={1}>
      <Title>
        {isUserTheImpostor ? (
          <>
            <QuestionCircleFilled />{' '}
            <Translate
              pt="Pista? Que pista? Você é o impostor!"
              en="Clue? What clue? You are the impostor!"
            />
          </>
        ) : (
          <>
            <Translate pt="A pista secreta é" en="The secret clue is" /> <TextHighlight>{clue}</TextHighlight>
          </>
        )}
      </Title>

      <Instruction>
        <ViewIf isVisible={isUserTheCurrentPlayer && !isUserTheImpostor}>
          <>
            <IconAvatar icon={<ImageCardsIcon />} size="large" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com a pista secreta."
              en="Select a card that best fits the secret clue."
            />
          </>
        </ViewIf>
        <ViewIf isVisible={isUserTheCurrentPlayer && isUserTheImpostor}>
          <>
            <IconAvatar icon={<ImageCardsIcon />} size="large" shape="square" />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com as cartas que os outros
                jogadores estão usando."
              en="Select a card that best fits with what others are playing."
            />
          </>
        </ViewIf>
        <ViewIf isVisible={!isUserTheCurrentPlayer}>
          <>
            <IconAvatar icon={<AnimatedClockIcon />} size="large" />{' '}
            <Translate
              pt={
                <>
                  Aguarde enquanto <AvatarName player={currentPlayer} addressUser /> escolhe uma carta.
                </>
              }
              en={
                <>
                  Wait while <AvatarName player={currentPlayer} /> picks a card.
                </>
              }
            />
          </>
        </ViewIf>
      </Instruction>

      <Table table={table} players={players} />

      <TurnOrder players={players} activePlayerId={currentPlayer.id} order={turnOrder} />

      <FloatingHand>
        <ImageCardHand
          hand={user.hand}
          onSelectCard={isUserTheCurrentPlayer ? onSelectCard : undefined}
          disabledSelectButton={isLoading}
          sizeRatio={6}
        />
      </FloatingHand>
    </Step>
  );
}
