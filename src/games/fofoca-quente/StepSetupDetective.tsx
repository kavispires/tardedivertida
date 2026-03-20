// Ant Design Resources
import { CompassOutlined } from '@ant-design/icons';
import { Alert, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Icons
import { TeenDetectiveIcon } from 'icons/TeenDetectiveIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState, SubmitDetectiveLocationPayload } from './utils/types';
import { useFofocaQuenteContext } from './utils/FofocaQuenteContext';
import { SchoolBoard } from './components/SchoolBoard';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
import { Info } from './components/Info';
// Hooks

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
  bestFriendId,
  staff,
  onSubmitDetectiveLocation,
  // motivations,
}: StepSetupDetectiveProps) {
  const { detectiveLocationIndex } = useFofocaQuenteContext();

  const onSubmit = () => {
    if (detectiveLocationIndex !== null) {
      onSubmitDetectiveLocation({
        locationIndex: detectiveLocationIndex,
        shouldReady: true,
      });
    }
  };

  const hasLocation = !!user.locationIndexes?.at(-1);

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

      <SchoolBoard
        schoolBoard={schoolBoard}
        students={students}
        socialGroups={socialGroups}
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
                en={
                  <>
                    To start the game, first select which location on the school map you want to start.
                    <br />
                    On the school map, click on the compass icon <CompassOutlined /> next to the location name
                    to select it, then come back here to confirm.
                    <br />
                    Your position on the map will be represented by the icon{' '}
                    <IconAvatar
                      icon={<TeenDetectiveIcon />}
                      size="small"
                    />{' '}
                    and the gossiper will be able to see where you are at all times.
                  </>
                }
                pt={
                  <>
                    Para começar o jogo, primeiro selecione qual local no mapa da escola você quer começar.
                    <br />
                    No mapa da escola, clique no ícone de bússola <CompassOutlined /> ao lado do nome do local
                    para selecioná-lo, depois volte aqui para confirmar.
                    <br />
                    Sua posição no mapa será representada pelo ícone{' '}
                    <IconAvatar
                      icon={<TeenDetectiveIcon />}
                      size="small"
                    />{' '}
                    e o fofoqueiro poderá ver onde você está o tempo todo.
                  </>
                }
              />
              <br />

              {detectiveLocationIndex !== null && (
                <SendButton
                  onClick={onSubmit}
                  block
                  disabled={hasLocation}
                >
                  <Translate
                    en="Submit"
                    pt="Enviar"
                  />{' '}
                  {detectiveLocationIndex !== null && (
                    <strong>
                      <DualTranslate>{schoolBoard[detectiveLocationIndex].name}</DualTranslate>
                    </strong>
                  )}
                </SendButton>
              )}
              {hasLocation && (
                <Alert
                  className="mt-2"
                  type="success"
                  showIcon
                  title={
                    <Translate
                      en="All set! Let's wait for the gossiper to be ready."
                      pt="Tudo certo! Vamos aguardar o fofoqueiro ficar pronto."
                    />
                  }
                />
              )}
            </RuleInstruction>
          </div>
        </Flex>
      </Instruction>
    </Step>
  );
}
