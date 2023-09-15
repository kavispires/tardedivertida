// Ant Design Resources
import { Button, Space } from 'antd';
// Icons
import { BouncerIcon } from 'icons/BouncerIcon';
// Components
import { VIPNextPhaseButton } from 'components/vip';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepRankingProps = {
  user: GamePlayer;
  players: GamePlayers;
  ranking: GameRanking;
  goToPreviousStep: GenericFunction;
  round: GameRound;
};

export function StepRanking({ ranking, players, goToPreviousStep, round }: StepRankingProps) {
  const innerContent = (
    <>
      <Instruction contained>
        <Translate
          pt="Somente jogadores na área VIP são ranqueados, porque você não pode ganhar se não estiver lá!"
          en="Only players in the VIP area can be ranked since you can't win if you're not there"
        />
      </Instruction>
    </>
  );

  const actions = (
    <>
      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <VIPNextPhaseButton round={round} />
    </>
  );

  if (ranking.length === 0) {
    return (
      <Step>
        <Title size="small">
          <Translate pt="Ranking" en="Ranking" />?
        </Title>

        <Space className="space-container">
          <BouncerIcon width="120" />
        </Space>
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
          pt={<>Pontos por já estar no Time Vencedor.</>}
          en={<>Points for already being on the Winning Team.</>}
        />,
        <Translate
          pt={<>Pontos por entrar no Time Vencedor.</>}
          en={<>Points for joining the Winning Team.</>}
        />,
      ]}
      title={<Translate pt={<>Ranking da Área VIP</>} en={<>VIP Ranking</>} />}
      white
      subtitle={innerContent}
    >
      {actions}
    </StepRankingWrapper>
  );
}
