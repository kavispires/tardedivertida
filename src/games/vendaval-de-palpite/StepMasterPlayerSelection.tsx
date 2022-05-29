// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading, useGlobalState } from 'hooks';
// Components
import { AvatarCard, AvatarIcon } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';

type StepMasterPlayerSelectionProps = {
  players: GamePlayers;
  onMasterPlayerClick: GenericFunction;
};

export function StepMasterPlayerSelection({ players, onMasterPlayerClick }: StepMasterPlayerSelectionProps) {
  const { isLoading } = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  return (
    <Step key={1}>
      <Title>
        <AvatarIcon type="animated-clock" size="large" />
        <br />
        <Translate pt="Quem quer ser o Mestre?" en="Who wants to be the Master?" />
      </Title>

      <Instruction contained>
        <Space>
          {Object.values(players).map((player) => {
            if (isAdmin) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onMasterPlayerClick({ masterId: player.id })}
                >
                  <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />
                </TransparentButton>
              );
            }

            return <AvatarCard key={`p-a-${player.id}`} player={player} withName addressUser />;
          })}
        </Space>
      </Instruction>

      <Instruction>
        (
        <Translate pt="O administrator selecionará o mestre" en="The Admin will select the master" />)
      </Instruction>
    </Step>
  );
}
