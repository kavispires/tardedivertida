// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { CanvasSVG } from 'components/canvas';
import { MonsterCard } from 'components/cards/MonsterCard';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackRetratoFalado = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const cardWidth = useCardWidth(5, { minWidth: 250, maxWidth: 270 });
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.options, 'playerId'));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Retrato Falado Monstruoso', en: 'Monster Sketch' }} />
      <Space direction="vertical" align="center" className="contained margin">
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Dentre as ilustrações abaixo, qual melhor ilustra o mostro?
                <br />
                Foi você quem desenhou? Você pode votar em si mesmo se quiser.
              </>
            }
            en={
              <>
                Among the illustrations below, which one best illustrates the monster?
                <br />
                Is that your drawing? You may vote for yourself if you want.
              </>
            }
          />
        </RuleInstruction>

        <Space className="space-container">
          <MonsterCard currentMonster={track.data.card} showControls cardWidth={200} />
        </Space>

        <div className="a-drawings">
          {track.data.options.map((entry: PlainObject) => (
            <div className="a-drawings__entry" key={entry.playerId}>
              <CanvasSVG drawing={entry.drawing} width={cardWidth} className="a-drawing" />

              <Space className="space-container">
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(entry.playerId)}
                >
                  <Translate pt="Selecionar" en="Select" />
                </Button>
              </Space>
            </div>
          ))}
        </div>
      </Space>
    </>
  );
};
