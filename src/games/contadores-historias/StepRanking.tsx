// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GameRanking, GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { StepRankingWrapper } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { RuleInstruction } from 'components/text';
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
  translate: (pt: string, en: string, custom?: string | undefined) => string,
) => {
  switch (outcome) {
    case 'EVERYBODY_GOT':
      return translate(
        'Pontos porque o Contador de Histórias foi muito obscuro',
        'Points because the Storyteller was too vague',
      );
    case 'NOBODY_GOT':
      return translate(
        'Pontos porque o Contador de Histórias foi óbvio',
        'Points because the Storyteller was too obvious',
      );
    default:
      return translate('Pontos por acertar', 'Points for getting it right');
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
      gainedPointsDescriptions={[getGainedPointsText(outcome, translate), 'Pontos por votos em sua carta']}
      subtitle={
        <RuleInstruction type={outcome === 'NORMAL' ? 'event' : 'alert'}>
          {outcome === 'EVERYBODY_GOT' && (
            <Translate
              pt={
                <>
                  Todo mundo acertou! <PlayerAvatarName player={storyteller} />, da próxima vez, seja menos
                  óbvio(a).
                </>
              }
              en={
                <>
                  Everybody guessed it right! <PlayerAvatarName player={storyteller} />, be less obvious next
                  time.
                </>
              }
            />
          )}
          {outcome === 'NOBODY_GOT' && (
            <Translate
              pt={
                <>
                  Ninguém acertou! <PlayerAvatarName player={storyteller} />, da próxima vez, seja menos
                  obscuro.
                </>
              }
              en={
                <>
                  Nobody guessed it right! <PlayerAvatarName player={storyteller} />, next time be less
                  obscure.
                </>
              }
            />
          )}

          {outcome === 'NORMAL' && (
            <Translate
              pt={
                <>
                  Quem acertou ganha <PointsHighlight type="positive">3</PointsHighlight> pontos! Bom
                  trabalho, <PlayerAvatarName player={storyteller} />.
                </>
              }
              en={
                <>
                  Whoever guessed it right got <PointsHighlight type="positive">3</PointsHighlight> points!
                  Good job, <PlayerAvatarName player={storyteller} />
                </>
              }
            />
          )}
        </RuleInstruction>
      }
    >
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <SpaceContainer>
        <Button onClick={goToPreviousStep}>{translate('Voltar para Solução', 'Back to Solution')}</Button>
      </SpaceContainer>

      <HostNextPhaseButton round={round} />
    </StepRankingWrapper>
  );
}
