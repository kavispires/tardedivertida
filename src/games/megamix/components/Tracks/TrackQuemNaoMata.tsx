import clsx from 'clsx';
// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { ShooterIcon } from 'icons/ShooterIcon';
// Components
import { Avatar } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';
// AntDesign Resources

export const TrackQuemNaoMata = ({ onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(Object.keys(players)));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Quem Não Mata, Morre!', en: 'Mortal Standoff' }} />
      <Space direction="vertical" align="center" className="contained margin">
        <Instruction contained>
          <Translate
            pt={
              <>
                Estamos num impasse! O primeiro a se mexer leva bala! Em quem você atira primeiro? (Pode ser
                você mesmo)
              </>
            }
            en={<>A standoff! Who are you going to shoot first? (It could be yourself)</>}
          />
        </Instruction>

        <Space className="space-container" wrap>
          {sortPlayers(players).map((player, index, arr) => {
            return (
              <div key={player.id} className="qnm-shooter">
                <IconAvatar
                  icon={<ShooterIcon />}
                  size={48}
                  className={clsx(index >= arr.length / 2 && 'qnm-shooter__reverse')}
                />
                <Button
                  icon={<Avatar id={player.avatarId} size="small" />}
                  onClick={() => onSelect(player.id)}
                  type="primary"
                  loading={isLoading}
                  disabled={user.ready}
                >
                  {player.name}
                </Button>
              </div>
            );
          })}
        </Space>
      </Space>
    </>
  );
};
