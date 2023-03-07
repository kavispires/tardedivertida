import clsx from 'clsx';
// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { Avatar } from 'components/avatars';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { ShooterIcon } from 'icons/ShooterIcon';
import { sortPlayers } from 'utils/helpers';

export const TaskQuemNaoMata = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // // DEV Mock
  useMock(() => {
    onSelect(mockSelection(Object.keys(players)));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
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
        {sortPlayers(players, 'name').map((player, index, arr) => {
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
    </>
  );
};
