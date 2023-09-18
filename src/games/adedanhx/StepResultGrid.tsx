// Ant Design Resources
import { Space } from 'antd';
// Hooks
// Utils
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars';
import { LockIcon } from 'icons/LockIcon';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { AnswersGrid } from './components/Grid';
import { TimedButton } from 'components/buttons';
import { TrophyOutlined } from '@ant-design/icons';

type StepResultGridProps = {
  players: GamePlayers;
  user: GamePlayer;
  grid: AdedanhxGrid;
  answersGrid: Record<string, AnswerGridEntry>;
  goToNextStep: GenericFunction;
} & AnnouncementProps;

export function StepResultGrid({
  grid,
  players,
  answersGrid,
  goToNextStep,
  announcement,
}: StepResultGridProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt={<>Complete a grade</>} en={<>Complete the grid</>} />{' '}
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Faça na ordem que achar melhor e não esqueça de aperta do botão de cadeado{' '}
              <IconAvatar size="small" icon={<LockIcon />} /> a cada resposta para que seu tempo seja gravado
              corretamente.
              <br />
              Você tem <TimeHighlight>3 minutos</TimeHighlight>!
            </>
          }
          en={
            <>
              Write it in the order you think is best and don't forget to press the lock button{' '}
              <IconAvatar size="small" icon={<LockIcon />} /> after each answer.
              <br />
              You have <TimeHighlight>3 minutes</TimeHighlight>!
            </>
          }
        />
      </Instruction>

      <AnswersGrid grid={grid} answersGrid={answersGrid} players={players} />

      <Space className="space-container" align="center">
        <TimedButton duration={45} icon={<TrophyOutlined />} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>
    </Step>
  );
}
