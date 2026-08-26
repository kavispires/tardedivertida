// Ant Design Resources
import { PlusCircleFilled } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { BoxXIcon } from '@icons/BoxXIcon';
// Components
import { Icon } from '@components/general/Icon';
import { SpreadsheetCell, SpreadsheetGrid } from '@components/general/SpreadsheetGrid';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { SpeechBubble } from '@components/text/SpeechBubble';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackCruzaPalavras = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const availability: boolean[] = track.data.cells;

  const selectionOptions = {
    0: availability[0] ? `${track.data.cards[0].text} + ${track.data.cards[2].text}` : null,
    1: availability[1] ? `${track.data.cards[1].text} + ${track.data.cards[2].text}` : null,
    2: availability[2] ? `${track.data.cards[0].text} + ${track.data.cards[3].text}` : null,
    3: availability[3] ? `${track.data.cards[1].text} + ${track.data.cards[3].text}` : null,
  };

  const onSelect = (position: 0 | 1 | 2 | 3) => {
    onSubmitAnswer({
      data: { value: String(selectionOptions[position]) },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(
      mockSelection(
        availability.map((available, index) => (available ? index : null)).filter((v) => v !== null),
      ),
    );
  });

  const unavailableCell = <Icon icon={<BoxXIcon />} />;

  return (
    <>
      <MinigameTitle track={track} />
      <RuleInstruction type="action">
        <Translate
          pt={
            'Bob, o robot, escreveu a dica péssima abaixo usando sua "inteligência artificial", e agora?<br/>Aonde ela se encaixa na grade para que combine com a linha e a coluna?<br/>Selecione na célula apropriada!'
          }
          en="Bob the bot wrote this terrible clue below using its AI.
          <br/>
          Where does it fit in the grid where it would match the column and row?
          <br/>
          Select the appropriate grid cell!"
        />
      </RuleInstruction>

      <SpaceContainer>
        <PlayerAvatar
          avatarId="A"
          size="large"
        />{' '}
        <SpeechBubble shadow>{track.data.clue.text}</SpeechBubble>
      </SpaceContainer>

      <SpaceContainer>
        <SpreadsheetGrid
          columns={3}
          rows={3}
          topLeftCorner
        >
          <SpreadsheetCell header>{track.data.cards[0].text}</SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[1].text}</SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[2].text}</SpreadsheetCell>
          <SpreadsheetCell>
            {availability[0] ? (
              <CellPlusButton
                onClick={() => onSelect(0)}
                disabled={user.ready}
                loading={isLoading}
              />
            ) : (
              unavailableCell
            )}
          </SpreadsheetCell>
          <SpreadsheetCell>
            {availability[1] ? (
              <CellPlusButton
                onClick={() => onSelect(1)}
                disabled={user.ready}
                loading={isLoading}
              />
            ) : (
              unavailableCell
            )}
          </SpreadsheetCell>
          <SpreadsheetCell header>{track.data.cards[3].text}</SpreadsheetCell>
          <SpreadsheetCell>
            {availability[2] ? (
              <CellPlusButton
                onClick={() => onSelect(2)}
                disabled={user.ready}
                loading={isLoading}
              />
            ) : (
              unavailableCell
            )}
          </SpreadsheetCell>
          <SpreadsheetCell>
            {availability[3] ? (
              <CellPlusButton
                onClick={() => onSelect(3)}
                disabled={user.ready}
                loading={isLoading}
              />
            ) : (
              unavailableCell
            )}
          </SpreadsheetCell>
        </SpreadsheetGrid>
      </SpaceContainer>
    </>
  );
};

function CellPlusButton({ onClick, loading, ...rest }: ButtonProps) {
  return (
    <Button
      onClick={onClick}
      shape="circle"
      loading={loading}
      {...rest}
    >
      {!loading && <PlusCircleFilled />}
    </Button>
  );
}
