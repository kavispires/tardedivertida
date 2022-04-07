import { Button, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { AdminNextRoundButton } from 'components/admin';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { RankingBoard } from 'components/ranking';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { ScoringRules } from './RulesBlogs';

type StepRankingProps = {
  players: GamePlayers;
  storyteller: GamePlayer;
  outcome: 'EVERYBODY_GOT' | 'NOBODY_GOT' | 'NORMAL';
  ranking: GameRanking;
  round: GameRound;
  lastRound?: boolean;
  goToPreviousStep: GenericFunction;
};

export function StepRanking({
  players,
  ranking,
  outcome,
  storyteller,
  round,
  lastRound = false,
  goToPreviousStep,
}: StepRankingProps) {
  const { translate } = useLanguage();

  return (
    <Step fullWidth>
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <Instruction contained>
        {outcome === 'EVERYBODY_GOT' && (
          <Translate
            pt={
              <>
                Todo mundo acertou! <AvatarName player={storyteller} />, da próxima vez, seja menos óbvio(a).
              </>
            }
            en={
              <>
                Everybody guessed it right! <AvatarName player={storyteller} />, be less obvious next time.
              </>
            }
          />
        )}
        {outcome === 'NOBODY_GOT' && (
          <Translate
            pt={
              <>
                Ninguém acertou! <AvatarName player={storyteller} />, da próxima vez seja menos obscuro.
              </>
            }
            en={
              <>
                Nobody guessed it right! <AvatarName player={storyteller} />, next time be less obscure.
              </>
            }
          />
        )}

        {outcome === 'NORMAL' && (
          <Translate
            pt={
              <>
                Quem acertou ganha 3 pontos! Bom trabalho, <AvatarName player={storyteller} />.
              </>
            }
            en={
              <>
                Whoever guessed it right got 3 points! Good job, <AvatarName player={storyteller} />
              </>
            }
          />
        )}
      </Instruction>

      <RankingBoard ranking={ranking} players={players} />

      <Space className="space-container" align="center">
        <Button onClick={goToPreviousStep}>{translate('Voltar para Solução', 'Back to Solution')}</Button>
      </Space>

      <AdminNextRoundButton round={round} lastRound={lastRound} />
    </Step>
  );
}
