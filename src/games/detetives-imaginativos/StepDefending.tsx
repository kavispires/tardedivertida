// Design Resources
import { Button } from 'antd';
// Components
import { AvatarName, ButtonContainer, Instruction, Step, Title, TitleHighlight, Translate } from 'components';
import TableFocus from './TableFocus';

type StepDefendingProps = {
  clue: string;
  currentPlayer: GamePlayer;
  isUserTheCurrentPlayer: boolean;
  table: DetetivesImaginativosCardEntry[];
  onFinishDefenseClick: GenericFunction;
  isLoading: boolean;
};

function StepDefending({
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
        <TitleHighlight>{clue}</TitleHighlight>
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
        <ButtonContainer>
          <Button type="primary" onClick={onFinishDefenseClick} disabled={isLoading} size="large">
            <Translate pt="Concluir Defesa" en="End Defense" />
          </Button>
        </ButtonContainer>
      )}

      <TableFocus table={table} currentPlayer={currentPlayer} />
    </Step>
  );
}

export default StepDefending;
