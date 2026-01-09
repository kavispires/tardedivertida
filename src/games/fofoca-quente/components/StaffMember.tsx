import { useToggle } from 'react-use';
// Ant Design Resources
import { Button, Card, Tag } from 'antd';
// Components
import { ModalOverlay } from 'components/general/ModalOverlay';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { StaffMember } from '../utils/types';
import { StudentIcon } from './StudentIcon';

type StaffMemberProps = {
  id: string;
  staffMembers: Dictionary<StaffMember>;
};

export function StaffMemberEntry({ id, staffMembers }: StaffMemberProps) {
  const staffMember = staffMembers[id];
  const [open, toggleOpen] = useToggle(false);

  return (
    <div className="staff-member">
      <Button
        onClick={toggleOpen}
        size="small"
        icon={<StudentIcon iconId={staffMember.type} />}
        type="text"
      />

      <StaffMemberModal
        staffMember={staffMember}
        open={open}
        onClose={toggleOpen}
      />
    </div>
  );
}

type StaffMemberModalProps = {
  staffMember: StaffMember;
  open: boolean;
  onClose: () => void;
};

function StaffMemberModal({ staffMember, open, onClose }: StaffMemberModalProps) {
  return (
    <ModalOverlay
      onClose={onClose}
      open={open}
    >
      <Card>
        <div className="student-details">
          <ImageCard cardId={staffMember.id} />
          <div>
            <div className="student-details__name">
              <StudentIcon iconId={staffMember.type} /> <DualTranslate>{staffMember.name}</DualTranslate>
            </div>

            <div className="student-details__title">
              <Tag color="blue-inverse">
                <Translate
                  en="Action for the Detective"
                  pt="Ação para o Detetive"
                />
              </Tag>{' '}
              <DualTranslate>{staffMember.description}</DualTranslate>
            </div>
          </div>
        </div>
      </Card>
    </ModalOverlay>
  );
}
