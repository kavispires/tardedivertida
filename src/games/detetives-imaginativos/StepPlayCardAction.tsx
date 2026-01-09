import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCountdown } from 'hooks/useCountdown';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getRandomItem } from 'utils/helpers';
// Icons
import { ImageCardsIcon } from 'icons/ImageCardsIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { messageContent } from 'components/pop-up';
import { StepTitle, RuleInstruction } from 'components/text';
import { TimedTimerClock, WaitingTime } from 'components/timers';
import { ViewOr } from 'components/views';
// Internal
import type { CardEntry, SubmitPlayCardPayload } from './utils/types';
import { isEarliestPlayerWithFewestCards } from './utils/helpers';
import { Table } from './components/Table';
import { ImposterTitle, SecretClueTitle } from './components/Titles';

const PREVENT_USER_FROM_CLICKING_TIME = 10;

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

  useMock(
    () => {
      onPlayCard({ cardId: getRandomItem(user.hand) });
    },
    [],
    8,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      table.length !== 0 &&
      currentPlayer.id === user.id &&
      !wasMessageDisplayed &&
      !isLoading &&
      isEarliestPlayerWithFewestCards(table, user.id, turnOrder)
    ) {
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

  const { timeLeft } = useCountdown({ duration: PREVENT_USER_FROM_CLICKING_TIME });

  return (
    <>
      <StepTitle>
        <StepTitle>{isUserTheImpostor ? <ImposterTitle /> : <SecretClueTitle clue={clue} />}</StepTitle>
      </StepTitle>

      <RuleInstruction type="action">
        <ViewOr condition={isUserTheImpostor}>
          {/** biome-ignore lint/complexity/noUselessFragments: View Container TODO: could it be a div? */}
          <>
            <IconAvatar
              icon={<ImageCardsIcon />}
              size="large"
              shape="square"
            />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com as cartas que os outros
                jogadores estão usando."
              en="Select a card that best fits with what others are playing."
            />
          </>

          {/** biome-ignore lint/complexity/noUselessFragments: View Container TODO: could it be a div? */}
          <>
            <IconAvatar
              icon={<ImageCardsIcon />}
              size="large"
              shape="square"
            />{' '}
            <Translate
              pt="Selecione uma carta que mais combine com a pista secreta."
              en="Select a card that best fits the secret clue."
            />
          </>
        </ViewOr>
        <TimedTimerClock
          duration={75}
          onExpire={() => onSelectCard('back-default')}
        />
      </RuleInstruction>

      <Table
        table={table}
        players={players}
      />

      <TurnOrder
        players={players}
        activePlayerId={currentPlayer.id}
        order={turnOrder}
        reorderByUser={leaderId}
      />

      <WaitingTime
        timeLeft={timeLeft}
        duration={PREVENT_USER_FROM_CLICKING_TIME}
      />

      <ImageCardHand
        hand={user.hand}
        onSelectCard={onSelectCard}
        disabledSelectButton={timeLeft > 0 || isLoading}
        sizeRatio={user.hand?.length}
      />
    </>
  );
}
