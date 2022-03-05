import { useEffect } from 'react';
// Design Resources
import { message } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import {
  AvatarName,
  Card,
  Instruction,
  messageContent,
  PopoverRule,
  Step,
  Title,
  Translate,
} from 'components';
import { CardPlayRules } from './RulesBlobs';
import { PlayTable } from './PlayTable';

type StepDreamsSelectionProps = {
  table: GImageCard[];
  word: GWord;
  onPlayCard: GenericFunction;
  user: GamePlayer;
  activePlayer: GamePlayer;
  isActivePlayer: boolean;
};

export function StepPlayDream({
  table,
  word,
  onPlayCard,
  user,
  activePlayer,
  isActivePlayer,
}: StepDreamsSelectionProps) {
  const { translate } = useLanguage();

  useEffect(() => {
    if (isActivePlayer) {
      message.info(
        messageContent(
          translate('Você controla!', 'You control!'),
          translate(
            'Selecione a carta-sonho que você acha que pelo menos um jogador vai dar match!',
            'Select the dream card you think will match at least one player'
          ),
          activePlayer.id,
          3
        )
      );
    }
  }, [isActivePlayer, activePlayer.id, translate]);

  return (
    <Step fullWidth>
      <Title level={2}>
        <Translate pt="Bingo dos Sonhos" en="Dream Bingo" />
      </Title>
      <Card header={translate('Tema', 'Theme')} randomColor>
        {word.text}
      </Card>

      <Instruction contained>
        {isActivePlayer ? (
          <Translate
            pt="Selecione a carta-sonho que você acha que pelo menos um jogador vai dar match!"
            en="Select the dream card you think will match at least one player"
          />
        ) : (
          <Translate
            pt={
              <>
                <AvatarName player={activePlayer} /> está selecionando um sonho.
              </>
            }
            en={
              <>
                <AvatarName player={activePlayer} /> is selecting a dream.
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
    </Step>
  );
}
