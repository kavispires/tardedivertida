// Components
import { Button } from 'antd';
import {
  AdminNextRoundButton,
  AvatarName,
  ButtonContainer,
  Instruction,
  PopoverRule,
  RankingBoard,
  Title,
  Translate,
} from 'components';
import { useLanguage } from 'hooks';
import { ScoringRules } from './RulesBlogs';

type StepRankingProps = {
  players: GamePlayers;
  storyteller: GamePlayer;
  outcome: 'EVERYBODY_GOT' | 'NOBODY_GOT' | 'NORMAL';
  ranking: GameRanking;
  round: GameRound;
  lastRound?: boolean;
  previousStep: GenericFunction;
};

export function StepRanking({
  players,
  ranking,
  outcome,
  storyteller,
  round,
  lastRound = false,
  previousStep,
}: StepRankingProps) {
  const { translate } = useLanguage();

  return (
    <div className="c-step-ranking">
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

      <ButtonContainer>
        <Button onClick={previousStep}>{translate('Voltar para Solução', 'Back to Solution')}</Button>
      </ButtonContainer>

      <AdminNextRoundButton round={round} lastRound={lastRound} />
    </div>
  );
}
