// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { WitnessRules } from './components/TextBlobs';

type StepWitnessSelectionProps = {
  players: GamePlayers;
  onWitnessButtonClick: GenericFunction;
};

export function StepWitnessSelection({ players, onWitnessButtonClick }: StepWitnessSelectionProps) {
  useTemporarilyHidePlayersBar();
  const { isLoading } = useLoading();
  const [isAdmin] = useGlobalState('isAdmin');

  return (
    <Step key={1}>
      <Title>
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />
        <br />
        <Translate pt="Quem quer ser a testemunha ocular?" en="Who wants to be the eye witness?" />
      </Title>

      <WitnessRules />

      <Instruction contained>
        <Space>
          {sortPlayers(players).map((player) => {
            if (isAdmin) {
              return (
                <TransparentButton
                  key={`p-bt-${player.id}`}
                  disabled={isLoading}
                  onClick={() => onWitnessButtonClick({ witnessId: player.id })}
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
        <Translate pt="O administrator selecionará a testemunha" en="The VIP will select the witness" />)
      </Instruction>
    </Step>
  );
}
