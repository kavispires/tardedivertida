// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound, GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';
import { PopoverRule } from '@components/rules/PopoverRule';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { Outcome } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';

type StepRankingProps = {
  players: GamePlayers;
  storyteller: GamePlayer;
  outcome: Outcome;
  ranking: GameRanking;
  round: GameRound;
  goToPreviousStep: UseStep['goToPreviousStep'];
};

const getGainedPointsText = (
  outcome: Outcome,
  translate: ({ pt, en, custom }: { pt: string; en: string; custom?: string }) => string,
) => {
  switch (outcome) {
    case 'EVERYBODY_GOT':
      return translate({
        pt: 'Pontos porque o Contador de Histórias foi muito obscuro',
        en: 'Points because the Storyteller was too vague',
      });
    case 'NOBODY_GOT':
      return translate({
        pt: 'Pontos porque o Contador de Histórias foi óbvio',
        en: 'Points because the Storyteller was too obvious',
      });
    default:
      return translate({ pt: 'Pontos por acertar', en: 'Points for getting it right' });
  }
};

export function StepRanking({
  players,
  ranking,
  outcome,
  storyteller,
  round,
  goToPreviousStep,
}: StepRankingProps) {
  const { translate } = useLanguage();

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        getGainedPointsText(outcome, translate),
        translate({ pt: 'Pontos por votos em sua carta', en: 'Points for votes on your card' }),
      ]}
      subtitle={
        <RuleInstruction type={outcome === 'NORMAL' ? 'event' : 'alert'}>
          {outcome === 'EVERYBODY_GOT' && (
            <Translate
              pt="Todo mundo acertou! {storyteller}, da próxima vez, seja menos óbvio(a)."
              en="Everybody guessed it right! {storyteller}, be less obvious next time."
              values={{ storyteller: <PlayerAvatarName player={storyteller} /> }}
            />
          )}
          {outcome === 'NOBODY_GOT' && (
            <Translate
              pt="Ninguém acertou! {storyteller}, da próxima vez, seja menos obscuro."
              en="Nobody guessed it right! {storyteller}, next time be less obscure."
              values={{ storyteller: <PlayerAvatarName player={storyteller} /> }}
            />
          )}

          {outcome === 'NORMAL' && (
            <Translate
              pt="Quem acertou ganha {points}! Bom trabalho, {storyteller}."
              en="Whoever guessed it right got {points}! Good job, {storyteller}"
              values={{
                points: (
                  <PointsHighlight
                    type="positive"
                    value={3}
                  />
                ),
                storyteller: <PlayerAvatarName player={storyteller} />,
              }}
            />
          )}
        </RuleInstruction>
      }
    >
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <SpaceContainer>
        <Button onClick={goToPreviousStep}>
          {translate({ pt: 'Voltar para Solução', en: 'Back to Solution' })}
        </Button>
      </SpaceContainer>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
