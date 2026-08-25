// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRound, GameRanking, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Icons
import { BouncerIcon } from '@icons/BouncerIcon';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { ListOfPlayers } from '@components/players/ListOfPlayers';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';
import { Step } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { useColorizeBackground } from './utils/useColorizeBackground';

type StepRankingProps = {
  user: GamePlayer;
  players: GamePlayers;
  ranking: GameRanking;
  goToPreviousStep: UseStep['goToPreviousStep'];
  round: GameRound;
  penaltyPlayers: UID[];
  bonusPlayers: UID[];
};

export function StepRanking({
  ranking,
  players,
  goToPreviousStep,
  round,
  user,
  penaltyPlayers,
  bonusPlayers,
}: StepRankingProps) {
  // Dynamic background
  useColorizeBackground(user, round.current + 1);

  const innerContent = (
    <>
      <RuleInstruction type="alert">
        <Translate
          pt="Somente jogadores na área VIP são ranqueados, porque você não pode ganhar se não estiver lá!"
          en="Only players in the VIP area can be ranked since you can't win if you're not there. We are elitist!"
        />
      </RuleInstruction>
    </>
  );

  const actions = (
    <>
      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          <Translate
            pt="Ver resultado novamente"
            en="See results again"
          />
        </Button>
      </SpaceContainer>
      <HostNextPhaseButton round={round} />
    </>
  );

  if (ranking.length === 0) {
    return (
      <Step>
        <StepTitle size="small">
          <Translate
            pt="Ranking"
            en="Ranking"
          />
          ?
        </StepTitle>

        <SpaceContainer>
          <BouncerIcon width="120" />
        </SpaceContainer>
        {innerContent}
        {actions}
      </Step>
    );
  }

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Pontos por já estar na Área VIP."
          en="Points for already being in the VIP Area."
        />,
        <Translate
          key="2"
          pt="Pontos por entrar a Área VIP."
          en="Points for joining the VIP Area."
        />,
        <Translate
          key="3"
          pt="Pontos bônus por ser o jogador em último lugar e conseguir entrar na Área VIP."
          en="Bonus points for being the last player and managing to enter the VIP Area."
        />,
        <Translate
          key="4"
          pt="Penalidade por ser o melhor jogador de todos e conseguir sair da área VIP."
          en="Penalty for being the best player and managing to leave the VIP Area."
        />,
      ]}
      title={
        <Translate
          pt="Ranking da Área VIP"
          en="VIP Ranking"
        />
      }
      subtitle={innerContent}
    >
      {penaltyPlayers.length > 0 && (
        <RuleInstruction type="event">
          <Translate
            pt={`{penalizedPlayers} ${penaltyPlayers.length === 1 ? 'estava' : 'estavam'} em primeiro lugar e ${penaltyPlayers.length === 1 ? 'foi' : 'foram'} tirado da Área VIP e perdeu {points}!`}
            en={`{penalizedPlayers} ${penaltyPlayers.length === 1 ? 'was' : 'were'} in first place and got kicked out of the VIP Area and lost {points}!`}
            values={{
              penalizedPlayers: (
                <ListOfPlayers
                  players={players}
                  list={penaltyPlayers}
                  prefix="penalized"
                />
              ),
              points: (
                <PointsHighlight
                  type="negative"
                  value={2}
                />
              ),
            }}
          />
        </RuleInstruction>
      )}

      {bonusPlayers.length > 0 && (
        <RuleInstruction type="event">
          <Translate
            pt={`{bonusPlayers} ${bonusPlayers.length === 1 ? 'estava' : 'estavam'} em último lugar e ${bonusPlayers.length === 1 ? 'conseguiu' : 'conseguiram'} entrar na Área VIP e ganhou {points}!`}
            en={`{bonusPlayers} ${bonusPlayers.length === 1 ? 'was' : 'were'} in last place and managed to enter the VIP Area and gained {points}!`}
            values={{
              bonusPlayers: (
                <ListOfPlayers
                  players={players}
                  list={bonusPlayers}
                  prefix="bonus"
                />
              ),
              points: (
                <PointsHighlight
                  type="positive"
                  value={2}
                  bonus
                />
              ),
            }}
          />
        </RuleInstruction>
      )}

      {actions}
    </StepRankingWrapper>
  );
}
