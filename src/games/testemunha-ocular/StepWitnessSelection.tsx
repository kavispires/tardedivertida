// Ant Design Resources
import { Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
import { useHost } from 'hooks/useHost';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { WitnessRules } from './components/TextBlobs';

type StepWitnessSelectionProps = {
  players: GamePlayers;
  onWitnessButtonClick: GenericFunction;
} & AnnouncementProps;

export function StepWitnessSelection({
  players,
  onWitnessButtonClick,
  announcement,
}: StepWitnessSelectionProps) {
  useTemporarilyHidePlayersBar();
  const { isLoading } = useLoading();
  const isHost = useHost();

  return (
    <Step announcement={announcement}>
      <Title>
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />
        <br />
        <Translate pt="Quem quer ser a testemunha ocular?" en="Who wants to be the eye witness?" />
      </Title>

      <WitnessRules />

      <Instruction contained>
        <Space>
          {sortPlayers(players).map((player) => {
            if (isHost) {
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

      <RuleInstruction type="event">
        <Translate pt="O Anfitrião selecionará a testemunha" en="The Host will select the witness" />
      </RuleInstruction>
    </Step>
  );
}
