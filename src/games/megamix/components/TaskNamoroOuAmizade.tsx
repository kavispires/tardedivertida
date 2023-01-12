// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { ImageCard } from 'components/cards';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';

export const TaskNamoroOuAmizade = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.heads, 'id'));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Dos <strong>3 partidos</strong> abaixo, qual é o melhor?
            </>
          }
          en={
            <>
              From <strong>3 candidates</strong> below, which one is the best one?
            </>
          }
        />
      </Instruction>

      <div className="noa-candidates">
        {task.data.heads.map((head: DatingCandidateImageCard, index: number) => {
          return (
            <Space className="space-container" direction="vertical">
              <Candidate
                head={head}
                body={task.data.bodies[index]}
                interest={task.data.interests[index]}
                need={task.data.needs[index]}
                funFact={task.data.funFacts[index]}
              />
              <Button
                onClick={() => onSelect(head.id)}
                disabled={user.ready || isLoading}
                className="noa-button"
                key={head.id}
                type="primary"
                shape="round"
              >
                <Translate pt="Esse" en="This one" />
              </Button>
            </Space>
          );
        })}
      </div>
    </>
  );
};

type CandidateProps = {
  head: DatingCandidateImageCard;
  body: DatingCandidateImageCard;
  interest: DatingCandidateCard;
  need: DatingCandidateCard;
  funFact: DatingCandidateCard;
};

export const Candidate = ({ head, body, interest, need, funFact }: CandidateProps) => {
  return (
    <div className="noa-candidate">
      <div className="noa-candidate__image">
        <div className="noa-candidate__text">
          <DualTranslate>{head.name}</DualTranslate>
        </div>
        <ImageCard cardWidth={100} imageId={head.id} />
        <ImageCard cardWidth={100} imageId={body.id} />
        <div className="noa-candidate__text">
          <DualTranslate>{body.name}</DualTranslate>
        </div>
      </div>
      <div className="noa-candidate__info">
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Curto/Quero" en="I enjoy/wish to" />
          </div>
          {interest.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Quero alguém que" en="I want someone who" />
          </div>
          {need.text}
        </div>
        <div className="noa-candidate__info-entry">
          <div className="noa-candidate__info-label">
            <Translate pt="Uma coisa sobre mim" en="Something about me" />
          </div>
          {funFact.text}
        </div>
      </div>
    </div>
  );
};
