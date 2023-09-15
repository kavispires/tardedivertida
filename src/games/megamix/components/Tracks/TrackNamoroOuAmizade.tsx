// AntDesign Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from '../MinigameTitle';
import { Candidate } from '../Candidate';

export const TrackNamoroOuAmizade = ({ track, round, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.heads, 'id'));
  });

  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />
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
        {track.data.heads.map((head: DatingCandidateImageCard, index: number) => {
          return (
            <Space className="space-container" direction="vertical">
              <Candidate
                head={head}
                body={track.data.bodies[index]}
                interest={track.data.interests[index]}
                need={track.data.needs[index]}
                funFact={track.data.funFacts[index]}
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
