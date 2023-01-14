// AntDesign Resources
import { Button, ButtonProps, Space } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
// Hooks
import { useMock } from 'hooks/useMock';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Avatar } from 'components/avatars';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { SpreadsheetCell, SpreadsheetGrid } from 'components/general/SpreadsheetGrid';

export const TaskCruzaPalavras = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (position: number) => {
    onSubmitTask({
      data: { value: String(position) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([0, 1, 2, 3]));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Alguém escreveu a dica péssima abaixo, e agora? Aonde ela se encaixa na grade?
              <br />
              Clique na célula apropriada!
            </>
          }
          en={
            <>
              Someone wrote this terrible clue below, where does it fit in the grid? Click the appropriate
              grid cell!
            </>
          }
        />
      </Instruction>

      <Card header={translate('Dica', 'Clue')} color="red">
        <Avatar id="A" /> {task.data.clue.text}
      </Card>

      <Space className="space-container">
        <SpreadsheetGrid columns={3} rows={3} topLeftCorner>
          <SpreadsheetCell header>{task.data.cards[0].text}</SpreadsheetCell>
          <SpreadsheetCell header>{task.data.cards[1].text}</SpreadsheetCell>
          <SpreadsheetCell header>{task.data.cards[2].text}</SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(0)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(1)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
          <SpreadsheetCell header>{task.data.cards[3].text}</SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(2)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(3)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
        </SpreadsheetGrid>
      </Space>
    </>
  );
};

function CellPlusButton({ onClick, loading, ...rest }: ButtonProps) {
  return (
    <Button onClick={onClick} shape="circle" loading={loading} {...rest}>
      {!loading && <PlusCircleFilled />}
    </Button>
  );
}
