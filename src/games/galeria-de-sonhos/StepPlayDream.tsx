import { useEffect, useState } from 'react';
// Ant Design Resources
import { RobotOutlined } from '@ant-design/icons';
import { App } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { AvatarName } from 'components/avatars';
import { FixedMenuButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { messageContent } from 'components/pop-up';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { ImageCardObj } from './utils/types';
import { BotsRules, CardPlayRules } from './components/RulesBlobs';
import { PlayTable } from './components/PlayTable';
import { PlayersDreamsCount } from './components/PlayersDreamsCount';

type StepDreamsSelectionProps = {
  table: ImageCardObj[];
  word: TextCard;
  onPlayCard: GenericFunction;
  user: GamePlayer;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  isLoading?: boolean;
  players: GamePlayers;
  gameOrder: GameOrder;
  setLastTurnCount: GenericFunction;
  playerInNightmareId?: PlayerId;
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
  useTemporarilyHidePlayersBar();
  const { translate } = useLanguage();
  const [showedMessage, setShowedMessage] = useState(false);

  useEffect(() => {
    setLastTurnCount(activePlayer.id);
  });

  useEffect(() => {
    if (isActivePlayer && !isLoading && !showedMessage) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate(
            'Selecione a carta-sonho que você acha que vai dar match com pelo menos um jogador!',
            'Select the dream card you think will match at least one player'
          ),
          activePlayer.id,
          3
        )
      );
      setShowedMessage(true);
    }
  }, [isActivePlayer, activePlayer.id, translate, isLoading, showedMessage, message]);

  return (
    <Step fullWidth>
      <Title size="small" white>
        <Translate pt="Bingo dos Sonhos" en="Dream Bingo" />
      </Title>
      <Card header={translate('Tema', 'Theme')} color="purple">
        {word.text}
      </Card>

      <PlayersDreamsCount players={players} playerInNightmareId={playerInNightmareId} />

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

      {Boolean(user.fallen) && !Boolean(user.inNightmare) && (
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
                <AvatarName player={activePlayer} className={getAnimationClass('flash')} /> está selecionando
                um sonho.
              </>
            }
            en={
              <>
                <AvatarName player={activePlayer} className={getAnimationClass('flash')} /> is selecting a
                dream.
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
          label={<Translate pt=" Bots" en=" Bots" />}
        />
      )}

      <PlayTable
        table={table}
        onPlayCard={(cardId: string) => onPlayCard({ cardId })}
        userCards={user.cards ?? {}}
        isPlayAvailable={isActivePlayer}
      />

      <TurnOrder players={players} order={gameOrder} activePlayerId={activePlayer.id} />
    </Step>
  );
}
