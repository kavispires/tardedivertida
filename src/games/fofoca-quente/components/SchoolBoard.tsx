// Components
import { TransparentButton } from 'components/buttons';
import { DualTranslate } from 'components/language';
import { ZoomPanPinchContainer } from 'components/layout/ZoomPanPinchContainer';
// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { StudentCard } from './StudentCard';
import { StaffMemberEntry } from './StaffMember';
// Images
import bgImage from '../assets/school-board.jpg';

type SchoolBoardProps = {
  selectStudent: (studentId: string) => void;
  schoolBoard: FofocaQuenteDefaultState['schoolBoard'];
  students: FofocaQuenteDefaultState['students'];
  socialGroups: FofocaQuenteDefaultState['socialGroups'];
  staff: FofocaQuenteDefaultState['staff'];
};

export function SchoolBoard({ schoolBoard, students, socialGroups, selectStudent, staff }: SchoolBoardProps) {
  const size = 256;
  return (
    <ZoomPanPinchContainer
      maxWidth={size * 4}
      transformWrapperProps={{
        minScale: 0.5,
        maxScale: 2,
        smooth: true,
      }}
    >
      <div
        className="school-board"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: 4 * size,
          height: 4 * size,
          gridTemplateColumns: `repeat(4, ${size - 6}px)`,
          gridTemplateRows: `repeat(4, ${size - 6}px)`,
        }}
      >
        {schoolBoard.map((location) => (
          <div
            key={location.id}
            className="school-location"
          >
            <div className="school-location__header">
              <div className="school-location__name">
                <DualTranslate>{location.name}</DualTranslate>
              </div>
              {location.staff && (
                <div className="school-location__staff-member">
                  <StaffMemberEntry
                    id={location.staff}
                    staffMembers={staff}
                  />{' '}
                </div>
              )}
            </div>
            <div className="school-location__students">
              {location.students.map((studentId) => (
                <TransparentButton
                  key={studentId}
                  onClick={() => selectStudent(studentId)}
                  hoverType="tint"
                  className="school-location__student-button"
                >
                  <StudentCard
                    key={studentId}
                    student={students[studentId]}
                    socialGroup={socialGroups[students[studentId].socialGroupId]}
                    showInfo
                  />
                </TransparentButton>
              ))}
            </div>

            <div className="school-location__footer">D</div>
          </div>
        ))}
      </div>
    </ZoomPanPinchContainer>
  );
}
