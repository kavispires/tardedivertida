// Ant Design Resources
import { CompassOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// Components
import { TransparentButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { ZoomPanPinchContainer } from 'components/layout/ZoomPanPinchContainer';
// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { StudentCard } from './StudentCard';
import { StaffMemberEntry } from './StaffMember';
import { DetectiveToken } from './DetectiveToken';
import { useFofocaQuenteContext } from './FofocaQuenteContext';
// Images
import bgImage from '../assets/school-board.jpg';

type SchoolBoardProps = {
  schoolBoard: FofocaQuenteDefaultState['schoolBoard'];
  students: FofocaQuenteDefaultState['students'];
  socialGroups: FofocaQuenteDefaultState['socialGroups'];
  staff: FofocaQuenteDefaultState['staff'];
};

export function SchoolBoard({ schoolBoard, students, socialGroups, staff }: SchoolBoardProps) {
  const { onOpenStudentModal, detectiveLocationIndex, onSetDetectiveLocation, permissions } =
    useFofocaQuenteContext();

  const size = 256;
  return (
    <ZoomPanPinchContainer
      lockControlsOnInit
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
          gridTemplateColumns: `repeat(4, ${size}px)`,
          gridTemplateRows: `repeat(4, ${size}px)`,
        }}
      >
        {schoolBoard.map((location, index) => (
          <div
            key={location.id}
            className="school-location"
          >
            <div className="school-location__header">
              <div className="school-location__name">
                <DualTranslate>{location.name}</DualTranslate>
                {permissions.canMoveDetective && (
                  <Tooltip
                    title={
                      <Translate
                        pt="Clique para selecionar este local"
                        en="Click to select this location"
                      />
                    }
                  >
                    <Button
                      size="small"
                      shape="circle"
                      onClick={() => onSetDetectiveLocation(index)}
                      icon={<CompassOutlined />}
                      className="ml-2"
                    />
                  </Tooltip>
                )}
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
                  onClick={() => onOpenStudentModal(studentId)}
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

            <div className="school-location__footer">
              - {detectiveLocationIndex === index && <DetectiveToken />} -
            </div>
          </div>
        ))}
      </div>
    </ZoomPanPinchContainer>
  );
}
