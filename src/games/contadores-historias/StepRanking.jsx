import React from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Instruction, RankingBoard, Title, translate, Translate } from '../../components/shared';
import { AdminForceNextPhase } from '../../components/admin';
import { AvatarName } from '../../components/avatars';

function StepRanking({ players, ranking, outcome, storyteller }) {
  const language = useLanguage();

  return (
    <div className="c-step-ranking">
      <Title level={1}>
        <Translate pt="Resultado" en="Results" />
      </Title>

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

      <AdminForceNextPhase buttonText={translate('Próxima Rodada', 'Go to Next Round', language)} />
    </div>
  );
}

StepRanking.propTypes = {
  outcome: PropTypes.string,
  players: PropTypes.object,
  ranking: PropTypes.array,
  storyteller: PropTypes.object,
};

export default StepRanking;
