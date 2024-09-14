// Ant Design Resources
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, ButtonProps, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Avatar } from 'components/avatars';
import { SpreadsheetCell, SpreadsheetGrid } from 'components/general/SpreadsheetGrid';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';
// AntDesign Resources

export const TrackCruzaPalavras = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (position: number) => {
    onSubmitAnswer({
      data: { value: String(position) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([0, 1, 2, 3]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Cruza Palavras', en: 'Mixed Clues' }} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Bob, o robot, escreveu a dica péssima abaixo usando sua "inteligência artificial", e agora?
              <br />
              Aonde ela se encaixa na grade para que combine com a linha e a coluna?
              <br />
              Clique na célula apropriada!
            </>
          }
          en={
            <>
              Bob the bot wrote this terrible clue below using its AI.
              <br />
              Where does it fit in the grid where it would match the column and row?
              <br />
              Click the appropriate grid cell!
            </>
          }
        />
      </Instruction>

      <Space className="space-container">
        <Avatar id="A" size="large" /> <SpeechBubble shadow>{track.data.clue.text}</SpeechBubble>
      </Space>

      <Space className="space-container">
        <SpreadsheetGrid columns={3} rows={3} topLeftCorner>
          <SpreadsheetCell header>{track.data.cards[0].text}</SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[1].text}</SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[2].text}</SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(0)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
          <SpreadsheetCell>
            <CellPlusButton onClick={() => onSelect(1)} disabled={user.ready} loading={isLoading} />
          </SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[3].text}</SpreadsheetCell>
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
