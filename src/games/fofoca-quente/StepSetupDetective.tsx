import { orderBy } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { Flex, Select } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState, SubmitDetectiveLocationPayload } from './utils/types';
import { SchoolBoard } from './components/SchoolBoard';
import { StudentModal } from './components/StudentModal';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
import { Info } from './components/Info';

type StepSetupDetectiveProps = {
  players: GamePlayers;
  user: GamePlayer;
  gossiperId: string;
  bestFriendId?: string;
  onSubmitDetectiveLocation: (payload: SubmitDetectiveLocationPayload) => void;
} & Pick<StepProps, 'announcement'> &
  Pick<FofocaQuenteDefaultState, 'schoolBoard' | 'students' | 'socialGroups' | 'staff' | 'motivations'>;

export function StepSetupDetective({
  user,
  announcement,
  schoolBoard,
  socialGroups,
  students,
  gossiperId,
  bestFriendId,
  staff,
  onSubmitDetectiveLocation,
  // motivations,
}: StepSetupDetectiveProps) {
  const { dualTranslate } = useLanguage();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);

  const onSubmit = () => {
    if (selectedLocationIndex !== null) {
      onSubmitDetectiveLocation({
        locationId: selectedLocationIndex,
        shouldReady: true,
      });
    }
  };

  const options = orderBy(
    schoolBoard.map((location, index) => ({
      label: dualTranslate(location.name),
      value: index,
    })),
    'label',
  );

  const hasLocation = user.locationId !== null && user.locationId !== undefined;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Preparando a escola</>}
          en={<>Setting up the school</>}
        />
      </StepTitle>

      <Info />

      <SchoolBoard
        schoolBoard={schoolBoard}
        students={students}
        socialGroups={socialGroups}
        selectStudent={setSelectedStudentId}
        staff={staff}
      />

      <Instruction contained>
        <Flex justify="center">
          <BoardSummary
            students={students}
            socialGroups={socialGroups}
          />

          <div>
            <DetectiveGoals bestFriendId={bestFriendId} />

            <RuleInstruction
              type="action"
              className="text-left"
            >
              <Translate
                en="To start the game, first select which location on the school map you want to start."
                pt="Para começar o jogo, primeiro selecione em qual localização do mapa da escola você quer começar."
              />
              <br />
              <Select
                options={options}
                onChange={setSelectedLocationIndex}
                placeholder={
                  <Translate
                    en="Select a location"
                    pt="Selecione um local"
                  />
                }
                style={{ width: 200 }}
                disabled={hasLocation}
              />

              <br />
              {selectedLocationIndex !== null && (
                <SendButton
                  onClick={onSubmit}
                  block
                  disabled={hasLocation}
                >
                  <Translate
                    en="Submit"
                    pt="Enviar"
                  />
                </SendButton>
              )}
            </RuleInstruction>
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
        />
      )}
    </Step>
  );
}
