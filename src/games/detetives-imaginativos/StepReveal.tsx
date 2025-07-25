// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { AvatarName } from 'components/avatars';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { StepRankingWrapper } from 'components/ranking';
import { Step, type StepProps } from 'components/steps';
import { RoundsLeftInstruction, RuleInstruction } from 'components/text';
// Internal
import type { CardEntry } from './utils/types';
import { TableFocus } from './components/TableFocus';
import { VotingOptions } from './components/VotingOptions';

type StepRevealProps = {
  impostor: GamePlayer;
  impostorVotes: number;
  players: GamePlayers;
  leaderId: PlayerId;
  round: GameRound;
  ranking: GameRanking;
  table: CardEntry[];
} & Pick<StepProps, 'announcement'>;

export function StepReveal({
  impostor,
  impostorVotes,
  players,
  leaderId,
  round,
  ranking,
  table,
  announcement,
}: StepRevealProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step announcement={announcement}>
      <StepRankingWrapper
        delay={5}
        players={players}
        ranking={ranking}
        gainedPointsDescriptions={[
          <Translate
            key="1"
            pt="Pontos ganhos por achar o impostor"
            en="Points gained for finding the impostor"
          />,
          <Translate
            key="2"
            pt="Pontos ganhos pelo impostor se safar"
            en="Points gained for the Impostor getting away"
          />,
        ]}
        title={
          <>
            <Translate pt="O impostor era " en="The impostor was " />
            <AvatarName player={impostor} />
          </>
        }
        subtitle={
          <>
            <RuleInstruction type="event">
              {impostorVotes > 1 ? (
                <Translate
                  pt={
                    <>
                      Ele(a) recebeu mais de dois votos! Quem votou nele(a) ganha{' '}
                      <PointsHighlight>3</PointsHighlight> pontos!
                    </>
                  }
                  en={
                    <>
                      They received more than 2 votes! Who voted for them gets{' '}
                      <PointsHighlight>3</PointsHighlight> points!
                    </>
                  }
                />
              ) : (
                <Translate
                  pt={
                    <>
                      Ele(a) não recebeu mais de 2 votos: <b>Impostor</b> ganha{' '}
                      <PointsHighlight>5</PointsHighlight> pontos e <b>Líder</b> ganha{' '}
                      <PointsHighlight>4</PointsHighlight>
                      pontos!
                    </>
                  }
                  en={
                    <>
                      They did not get enough votes: the <b>Impostor</b> gets{' '}
                      <PointsHighlight>5</PointsHighlight> points and the <b>Lead Detective</b> gets{' '}
                      <PointsHighlight>4</PointsHighlight> points!
                    </>
                  }
                />
              )}
            </RuleInstruction>
            <VotingOptions players={players} isAllDisabled={true} leaderId={leaderId} onVote={() => {}} />
          </>
        }
      >
        <RoundsLeftInstruction round={round} />

        <TableFocus table={table} currentPlayer={impostor} />

        <HostNextPhaseButton round={round} />
      </StepRankingWrapper>
    </Step>
  );
}
