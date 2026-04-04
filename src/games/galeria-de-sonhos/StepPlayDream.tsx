import { useEffect, useState } from 'react';
// Ant Design Resources
import { RobotOutlined } from '@ant-design/icons';
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { FixedMenuButton } from 'components/buttons/FixedMenuButton';
import { Card } from 'components/cards/Card';
import { Translate } from 'components/language/Translate';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { TurnOrder } from 'components/players/TurnOrder';
import { messageContent } from 'components/pop-up/messageContent';
import { PopoverRule } from 'components/rules/PopoverRule';
import { Step } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { ImageCardObj, PlayCardPayload } from './utils/types';
import { BotsRules, CardPlayRules } from './components/RulesBlobs';
import { PlayTable } from './components/PlayTable';
import { PlayersDreamsCount } from './components/PlayersDreamsCount';

type StepDreamsSelectionProps = {
  table: ImageCardObj[];
  word: TextCard;
  onPlayCard: (payload: PlayCardPayload) => void;
  user: GamePlayer;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  isLoading?: boolean;
  players: GamePlayers;
  gameOrder: GameOrder;
  setLastTurnCount: React.Dispatch<React.SetStateAction<string>>;
  playerInNightmareId?: UID;
  botEnabled?: boolean;
};

export function StepPlayDream({
  table,
  word,
  onPlayCard,
  user,
  activePlayer,
  isActivePlayer,
  isLoading,
  players,
  gameOrder,
  setLastTurnCount,
  playerInNightmareId,
  botEnabled = false,
}: StepDreamsSelectionProps) {
  const { message } = App.useApp();

  const { translate } = useLanguage();
  const [showedMessage, setShowedMessage] = useState(false);

  useEffect(() => {
    setLastTurnCount(activePlayer.id);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: to avoid unnecessary renders
  useEffect(() => {
    if (isActivePlayer && !isLoading && !showedMessage) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate(
            'Selecione a carta-sonho que você acha que vai dar match com pelo menos um jogador!',
            'Select the dream card you think will match at least one player',
          ),
          activePlayer.id,
          3,
        ),
      );
      setShowedMessage(true);
    }
  }, [isLoading, showedMessage, message]);

  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle size="small">
        <Translate
          pt="Bingo dos Sonhos"
          en="Dream Bingo"
        />
      </StepTitle>
      <Card
        header={translate('Tema', 'Theme')}
        color="purple"
      >
        {word.text}
      </Card>

      <PlayersDreamsCount
        players={players}
        playerInNightmareId={playerInNightmareId}
      />

      {Boolean(user.fallen) && Boolean(user.inNightmare) && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Você estava em apuros e não conseguiu dar match em uma de suas cartas, então perdeu{' '}
                <PointsHighlight type="negative">1 ponto</PointsHighlight> por carta que você deu match.
              </>
            }
            en={
              <>
                You were in danger and didn't get a match in one of your cards. You lost{' '}
                <PointsHighlight type="negative">1 point</PointsHighlight> per scored card.
              </>
            }
          />
        </RuleInstruction>
      )}

      {Boolean(user.fallen) && !user.inNightmare && (
        <RuleInstruction type="event">
          <Translate
            pt={<>Você não conseguiu dar match em uma de suas cartas, e está fora da rodada.</>}
            en={<>You didn't get a match in one of your cards, and you're out of the round.</>}
          />
        </RuleInstruction>
      )}

      <RuleInstruction type={isActivePlayer ? 'action' : 'wait'}>
        {isActivePlayer ? (
          <Translate
            pt="Selecione a carta-sonho que você acha que vai dar match com pelo menos um jogador!"
            en="Select the dream card you think will match at least one player"
          />
        ) : (
          <Translate
            pt={
              <>
                <PlayerAvatarName
                  player={activePlayer}
                  className={getAnimationClass('flash')}
                />{' '}
                está selecionando um sonho.
              </>
            }
            en={
              <>
                <PlayerAvatarName
                  player={activePlayer}
                  className={getAnimationClass('flash')}
                />{' '}
                is selecting a dream.
              </>
            }
          />
        )}
      </RuleInstruction>

      <PopoverRule content={<CardPlayRules />} />

      {botEnabled && (
        <FixedMenuButton
          type="popover"
          position={1}
          icon={<RobotOutlined />}
          content={<BotsRules />}
          label={
            <Translate
              pt=" Bots"
              en=" Bots"
            />
          }
        />
      )}

      <PlayTable
        table={table}
        onPlayCard={(cardId: string) => onPlayCard({ cardId })}
        userCards={user.cards ?? {}}
        isPlayAvailable={isActivePlayer}
      />

      <TurnOrder
        players={players}
        order={gameOrder}
        activePlayerId={activePlayer.id}
      />
    </Step>
  );
}
