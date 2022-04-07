// Ant Design Resources
import { Button, Space } from 'antd';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { View, ViewSwitch } from 'components/views';
// Hooks
import { useLanguage, useLoading } from 'hooks';
// Components

import { EspiaoEntreNosCard as Card } from './Card';
import { LocationsList } from './LocationsList';
import { Notes } from './Notes';
import { SuspectsList } from './SuspectsList';

type StepVotingProps = {
  user: GamePlayer;
  locations: ELocation[];
  players: GamePlayers;
  onSubmitVote: GenericFunction;
  accuser: GamePlayer;
  isUserTheAccuser: boolean;
  target: GamePlayer;
  isUserTheTarget: boolean;
};

export function StepVoting({
  user,
  locations,
  players,
  onSubmitVote,
  accuser,
  isUserTheAccuser,
  target,
  isUserTheTarget,
}: StepVotingProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  return (
    <Step className="e-phase-step">
      <Title level={2} className="e-phase-title">
        <Translate
          pt={`${accuser.name} está acusando ${target.name} de ser o espião. Concorda?`}
          en={`${accuser.name} is accusing ${target.name} to be the spy. Do you agree?`}
        />
      </Title>

      <ViewSwitch cases={[isUserTheAccuser, isUserTheTarget, true]}>
        <View key="accuser">
          <Instruction className="e-phase-instruction">
            <Translate
              pt="Você não participa dessa votação, afinal, você quem acusou!"
              en="You do not join the voting, after all, you triggered it!"
            />
          </Instruction>
        </View>

        <View key="target">
          <Instruction className="e-phase-instruction">
            <Translate
              pt="Você não participa dessa votação, afinal, é você quem está no paredão!"
              en="You do not joint the voting, after all, you are the target"
            />
          </Instruction>
        </View>

        <View key="others">
          {!user.ready ? (
            <Space>
              <Button ghost disabled={isLoading} onClick={() => onSubmitVote({ vote: true })}>
                <Translate pt="Também acho!" en="Agree!" />
              </Button>
              <Button ghost disabled={isLoading} onClick={() => onSubmitVote({ vote: false })}>
                <Translate pt="Não é ele(a)" en="It's not them" />
              </Button>
            </Space>
          ) : (
            <Instruction className="e-phase-instruction">
              <Translate pt="Voto computado" en="Vote accepted" />
            </Instruction>
          )}
        </View>
      </ViewSwitch>

      <Card location={user.location} role={user.role} />

      <ReadyPlayersBar
        players={players}
        readyText={translate('Votei', 'I voted')}
        readyTextPlural={translate('Votamos', 'We voted')}
        hideNames
      />

      <Instruction className="e-lists">
        <SuspectsList players={players} />
        <LocationsList locations={locations} />
      </Instruction>

      <Notes />
    </Step>
  );
}
