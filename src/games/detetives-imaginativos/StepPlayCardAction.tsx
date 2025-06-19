import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Icons
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { messageContent } from 'components/pop-up';
import { StepTitle, RuleInstruction } from 'components/text';
import { TimedTimerClock } from 'components/timers';
import { ViewOr } from 'components/views';
// Internal
import type { CardEntry, SubmitPlayCardPayload } from './utils/types';
import { isEarliestPlayerWithFewestCards } from './utils/helpers';
import { Table } from './components/Table';
import { ImposterTitle, SecretClueTitle } from './components/Titles';

type StepPlayCardActionProps = {
  isUserTheImpostor: boolean;
  clue: string;
  currentPlayer: GamePlayer;
  table: CardEntry[];
  players: GamePlayers;
  user: GamePlayer;
  onPlayCard: (payload: SubmitPlayCardPayload) => void;
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!wasMessageDisplayed && !isLoading && isEarliestPlayerWithFewestCards(table, user.id, turnOrder)) {
      message.info(
        messageContent(
          translate('Escolha uma carta!', 'Choose a card to play'),
          translate(
            'Aperte o botão Selecionar acima da carta escolhida',
            'Press the select button above each card',
          ),

          currentPlayer.id,
          3,
        ),
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
      <StepTitle>
        <StepTitle>{isUserTheImpostor ? <ImposterTitle /> : <SecretClueTitle clue={clue} />}</StepTitle>
      </StepTitle>

      <RuleInstruction type="action">
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
      </RuleInstruction>

      <Table table={table} players={players} />

      <TurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
        reorderByUser={leaderId}
      />

      <ImageCardHand
        hand={user.hand}
        onSelectCard={onSelectCard}
        disabledSelectButton={isLoading}
        sizeRatio={user.hand?.length}
      />
    </>
  );
}
