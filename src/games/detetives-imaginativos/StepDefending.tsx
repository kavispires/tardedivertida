// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { AvatarName, Instruction, Step, Title, TextHighlight, Translate } from 'components';
import { TableFocus } from './TableFocus';

type StepDefendingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  isUserTheCurrentPlayer: boolean;
  table: DetetivesImaginativosCardEntry[];
  onFinishDefenseClick: GenericFunction;
  isLoading: boolean;
};

export function StepDefending({
  clue,
  currentPlayer,
  isUserTheCurrentPlayer,
  table,
  onFinishDefenseClick,
  isLoading,
}: StepDefendingProps) {
  return (
    <Step>
      <Title>
        <Translate pt="Pista Secreta era: " en="The Secret Clue was: " />
        <TextHighlight>{clue}</TextHighlight>
      </Title>
      <Instruction contained>
        <AvatarName player={currentPlayer} />,{' '}
        <Translate pt="explique porque você escolheu as cartas." en="explain why you chose your cards." />
        {isUserTheCurrentPlayer && (
          <>
            <Translate
              pt=" Quando terminar sua defesa, aperte concluir."
              en=" When you're done, press 'End Defense'"
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

      <TableFocus table={table} currentPlayer={currentPlayer} />
    </Step>
  );
}
