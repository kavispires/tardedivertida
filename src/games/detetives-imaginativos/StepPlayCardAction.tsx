import { useEffect, useState } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
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
import { IconAvatar } from 'components/avatars/IconAvatar';
import { ImageCardHand } from 'components/image-cards/ImageCardHand';
import { Translate } from 'components/language/Translate';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { messageContent } from 'components/pop-up/messageContent';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
import { TimedTimerClock } from 'components/timers/TimedTimerClock';
import { WaitingTime } from 'components/timers/WaitingTime';
import { ViewIf } from 'components/views/ViewIf';
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
  leaderId: UID;
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to trigger this effect when the current player changes, not when the user receives new cards in hand for example, which would cause the message to be displayed again
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
          translate({ pt: 'Escolha uma carta!', en: 'Choose a card to play' }),
          translate({
            pt: 'Aperte o botão Selecionar acima da carta escolhida',
            en: 'Press the select button above each card',
          }),

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
        <ViewIf condition={isUserTheImpostor}>
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
        </ViewIf>
        <ViewIf condition={!isUserTheImpostor}>
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
        </ViewIf>
        <TimedTimerClock
          duration={75}
          onExpire={() => onSelectCard('back-default')}
        />
      </RuleInstruction>

      <Table
        table={table}
        players={players}
      />

      <PlayersTurnOrder
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
