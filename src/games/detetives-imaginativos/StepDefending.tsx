// Ant Design Resources
import { Button, message, Space } from 'antd';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { useLanguage } from 'hooks';
import { useEffect } from 'react';
import { getAnimationClass } from 'utils/helpers';

import { TableFocus } from './components/TableFocus';

type StepDefendingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  isUserTheCurrentPlayer: boolean;
  table: DetetivesImaginativosCardEntry[];
  onFinishDefenseClick: GenericFunction;
  isLoading: boolean;
  isUserTheImpostor: boolean;
  user: GamePlayer;
};

export function StepDefending({
  clue,
  currentPlayer,
  isUserTheCurrentPlayer,
  table,
  onFinishDefenseClick,
  isLoading,
  isUserTheImpostor,
  user,
}: StepDefendingProps) {
  const { translate } = useLanguage();

  useEffect(() => {
    if (isUserTheCurrentPlayer && !isLoading) {
      message.info(
        messageContent(
          translate('Sua vez de defender suas escolhas!', "It's your turn to defend your choices"),
          translate(
            'Aperte o botão Concluir Defesa quando terminar',
            "Press the button End Defense when you're done"
          ),

          currentPlayer?.id,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.id, translate, isLoading]);

  return (
    <Step>
      <Title>
        <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
        <TextHighlight>{clue}</TextHighlight>
      </Title>
      <Instruction contained>
        <AvatarName key={currentPlayer.id} player={currentPlayer} className={getAnimationClass('tada')} />,{' '}
        <Translate pt="explique porque você escolheu as cartas." en="explain why you chose your cards." />
        {isUserTheCurrentPlayer && (
          <>
            <Translate
              pt=" Quando terminar sua defesa, aperte concluir."
              en=" When you're done, press 'End Defense'."
            />
          </>
        )}
        {isUserTheImpostor && (
          <>
            <br />
            <Translate
              pt=" Suas cartas estão no fim da página pra você começar a já pensar numa desculpa esfarrapada."
              en=" Your cards are displayed in the bottom of the page so you can think of your B.S.'"
            />
          </>
        )}
      </Instruction>

      {isUserTheCurrentPlayer && (
        <Space className="space-container" align="center">
          <Button type="primary" onClick={onFinishDefenseClick} disabled={isLoading} size="large">
            <Translate pt="Concluir Defesa" en="End Defense" />
          </Button>
        </Space>
      )}

      <Space className="space-container" align="center" wrap>
        <TableFocus table={table} currentPlayer={currentPlayer} />
        {isUserTheImpostor && (
          <div style={{ transform: 'scale(0.8)' }}>
            <Title size="x-small">
              <Translate pt="Suas cartas" en="Your cards" />
            </Title>
            <TableFocus table={table} currentPlayer={user} />
          </div>
        )}
      </Space>
    </Step>
  );
}
