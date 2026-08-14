// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { Title } from '@components/text/Title';
// Internal
import type { CardEntry } from './utils/types';
import { TableFocus } from './components/TableFocus';
import { VotingOptions } from './components/VotingOptions';

type StepRevealProps = {
  impostor: GamePlayer;
  impostorVotes: number;
  players: GamePlayers;
  leaderId: UID;
  table: CardEntry[];
  goToNextStep: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  impostor,
  impostorVotes,
  players,
  leaderId,

  table,
  announcement,
  goToNextStep,
}: StepRevealProps) {
  return (
    <Step
      announcement={announcement}
      hidePlayersBar
    >
      <Title>
        <Translate
          pt="O impostor era "
          en="The impostor was "
        />
        <PlayerAvatarName player={impostor} />
      </Title>

      <RuleInstruction type="event">
        {impostorVotes > 1 ? (
          <Translate
            pt={
              <>
                Ele(a) recebeu mais de dois votos! Quem votou nele(a) ganha <PointsHighlight value={3} />!
              </>
            }
            en={
              <>
                They received more than 2 votes! Who voted for them gets <PointsHighlight value={3} />!
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                Ele(a) não recebeu mais de 2 votos: <b>Impostor</b> ganha <PointsHighlight value={5} /> e{' '}
                <b>Líder</b> ganha <PointsHighlight value={4} />!
              </>
            }
            en={
              <>
                They did not get enough votes: the <b>Impostor</b> gets <PointsHighlight value={5} /> and the{' '}
                <b>Lead Detective</b> gets <PointsHighlight value={4} />!
              </>
            }
          />
        )}
      </RuleInstruction>
      <VotingOptions
        players={players}
        isAllDisabled={true}
        leaderId={leaderId}
        onVote={() => {}}
      />

      <TableFocus
        table={table}
        currentPlayer={impostor}
      />

      <SpaceContainer>
        <TimedButton
          duration={20}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>

      {/* <HostNextPhaseButton round={round} /> */}
    </Step>
  );
}
