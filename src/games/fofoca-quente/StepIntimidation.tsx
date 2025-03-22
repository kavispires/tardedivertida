import { useMemo, useState } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState, SubmitIntimidationPayload } from './utils/types';
import { ACTION_TYPES } from './utils/constants';
import { SchoolBoard } from './components/SchoolBoard';
import { StudentModal } from './components/StudentModal';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
// Hooks

type StepIntimidationProps = {
  players: GamePlayers;
  user: GamePlayer;
  gossiperId: string;
  bestFriendId?: string;
  onSubmitIntimidation: (payload: SubmitIntimidationPayload) => void;
  isTheGossiperPlayer: boolean;
  isTheDetectivePlayer: boolean;
} & Pick<StepProps, 'announcement'> &
  Pick<FofocaQuenteDefaultState, 'schoolBoard' | 'students' | 'socialGroups' | 'staff' | 'motivations'>;

export function StepIntimidation({
  user,
  announcement,
  schoolBoard,
  socialGroups,
  students,
  gossiperId,
  bestFriendId,
  staff,
  onSubmitIntimidation,
  // motivations,
  isTheGossiperPlayer,
  // isTheDetectivePlayer,
}: StepIntimidationProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [intimidations, setIntimidations] = useState<number>(0);

  const intimidateableStudents = useMemo(() => {
    return Object.values(students).filter((student) => !student.rumored && !student.intimidated).length;
  }, [students]);

  const onSubmit = (studentId: string) => {
    setIntimidations(intimidations + 1);
    onSubmitIntimidation({
      intimidatedStudentId: studentId,
      shouldGoToTheNextPhase: intimidations >= intimidateableStudents,
    });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Intimidação de dois estudantes</>} en={<>Intimidating two students</>} />
      </StepTitle>

      <SchoolBoard
        schoolBoard={schoolBoard}
        students={students}
        socialGroups={socialGroups}
        selectStudent={setSelectedStudentId}
        staff={staff}
      />

      <Instruction contained>
        <Flex justify="center">
          <BoardSummary students={students} socialGroups={socialGroups} />

          <div>
            <DetectiveGoals bestFriendId={bestFriendId} />
          </div>
        </Flex>
      </Instruction>

      {selectedStudentId && (
        <StudentModal
          student={students[selectedStudentId]}
          socialGroups={socialGroups}
          gossiperId={gossiperId}
          bestFriendId={bestFriendId}
          closeModal={() => setSelectedStudentId(null)}
          showSecrets={user.role === 'gossiper'}
          actionType={isTheGossiperPlayer ? ACTION_TYPES.INTIMIDATE : undefined}
          onPerformAction={isTheGossiperPlayer ? onSubmit : undefined}
        />
      )}
    </Step>
  );
}
