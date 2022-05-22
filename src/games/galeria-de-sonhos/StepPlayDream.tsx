import { useEffect, useState } from 'react';
// Ant Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { CardPlayRules } from './components/RulesBlobs';
import { PlayTable } from './components/PlayTable';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Card } from 'components/cards';
import { AvatarName } from 'components/avatars';
import { PopoverRule } from 'components/rules';
import { TurnOrder } from 'components/players';
import { PlayersDreamsCount } from './components/PlayersDreamsCount';
import { getAnimationClass } from 'utils/helpers';

type StepDreamsSelectionProps = {
  table: GImageCard[];
  word: GWord;
  onPlayCard: GenericFunction;
  user: GamePlayer;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
  isLoading?: boolean;
  players: GamePlayers;
  gameOrder: GameOrder;

  setLastTurnCount: GenericFunction;
  playerInNightmareId?: PlayerId;
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
}: StepDreamsSelectionProps) {
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
  }, [isActivePlayer, activePlayer.id, translate, isLoading, showedMessage]);

  return (
    <Step fullWidth>
      <Title size="small">
        <Translate pt="Bingo dos Sonhos" en="Dream Bingo" />
      </Title>
      <Card header={translate('Tema', 'Theme')} randomColor>
        {word.text}
      </Card>

      <PlayersDreamsCount players={players} playerInNightmareId={playerInNightmareId} />

      {Boolean(user.fallen) && (
        <Instruction contained>
          <Translate
            pt="Você estava em apuros e não conseguiu dar match em uma de suas cartas, então perdeu um ponto por carta que você deu match."
            en="You were in danger and didn't get a match in one of your cards. You lost 1 point per scored card."
          />
        </Instruction>
      )}

      <Instruction contained>
        {isActivePlayer ? (
          <Translate
            pt="Selecione a carta-sonho que você acha que vai dar match com pelo menos um jogador!"
            en="Select the dream card you think will match at least one player"
          />
        ) : (
          <Translate
            pt={
              <>
                <AvatarName player={activePlayer} className={getAnimationClass('tada')} /> está selecionando
                um sonho.
              </>
            }
            en={
              <>
                <AvatarName player={activePlayer} className={getAnimationClass('tada')} /> is selecting a
                dream.
              </>
            }
          />
        )}
      </Instruction>

      <PopoverRule content={<CardPlayRules />} />

      <PlayTable
        table={table}
        onPlayCard={(cardId: string) => onPlayCard({ cardId })}
        userCards={user.cards}
        isPlayAvailable={isActivePlayer}
      />

      <TurnOrder players={players} order={gameOrder} activePlayerId={activePlayer.id} />
    </Step>
  );
}
