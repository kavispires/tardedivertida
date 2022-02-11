import { useEffect } from 'react';
// Design Resources
import { Divider, message } from 'antd';
// Hooks
import { useCardWidth, useLanguage } from '../../hooks';
// Components
import {
  AdminNextRoundButton,
  AvatarName,
  Card,
  ImageCard,
  Instruction,
  PopoverRule,
  Step,
  TimedButton,
  Title,
  Translate,
} from '../../components';
import { CardPlayRules } from './RulesBlobs';
import { PlayTable } from './PlayTable';

type StepAnnounceDreamProps = {
  latest: LatestInfo;
  lastActivePlayer: GamePlayer;
  activePlayer: GamePlayer;
  setStep: GenericFunction;
  players: GamePlayers;
};

export function StepAnnounceDream({
  latest,
  lastActivePlayer,
  activePlayer,
  setStep,
  players,
}: StepAnnounceDreamProps) {
  const { translate } = useLanguage();
  const cardWidth = useCardWidth(5, 8, 140, 150);

  console.log({ activePlayer });

  return (
    <Step fullWidth>
      <Title level={2}>
        <AvatarName player={lastActivePlayer} />
        <Translate pt="escolheu" en="escolheu" />
      </Title>
      <ImageCard imageId={latest.cardId} cardWidth={cardWidth} />
      <Instruction contained>
        <MatchCount matchCount={latest.matchCount} lastActivePlayer={lastActivePlayer} />
        {latest.matchCount > 1 && (
          <div>
            <h2 className="g-announce-title">
              <Translate pt="Ganharam pontos:" en="Got points:" />
            </h2>
            <ListPlayers
              players={players}
              listPlayersIds={latest.matchedPlayers}
              className="g-matched-players-list"
            />
          </div>
        )}
        <Divider />
        {latest.fallenPlayers.length > 1 && (
          <div>
            <h2 className="g-announce-title">
              <Translate
                pt="Jogadores que usaram todos os sonhos:"
                en="Players who used all of their dreams:"
              />
            </h2>
            <ListPlayers
              players={players}
              listPlayersIds={latest.matchedPlayers}
              className="g-fallen-players-list"
            />
          </div>
        )}
        <Divider />

        <div>
          <h2 className="g-announce-title">
            <Translate pt="Próximo jogador:" en="Next player" />
          </h2>
          <div>
            <AvatarName player={activePlayer} addressUser size="large" />
          </div>
        </div>
      </Instruction>

      {latest.cardsLeft > 0 ? (
        <TimedButton
          disabled
          duration={15}
          onExpire={() => setStep(2)}
          label={<Translate pt="Continuando em..." en="Continuing in..." />}
        />
      ) : (
        <AdminNextRoundButton buttonText="Ranking" />
      )}
    </Step>
  );
}

type MatchCountProps = {
  matchCount: number;
  lastActivePlayer: GamePlayer;
};

function MatchCount({ matchCount, lastActivePlayer }: MatchCountProps) {
  const isSpark = matchCount > 0;
  const isSuperSpark = matchCount === 1;
  const isRegularSpark = matchCount > 1;

  return (
    <div>
      {isSpark ? (
        <Translate
          pt={
            <>
              <h2 className="g-announce-title">E deu match!</h2>
              {isSuperSpark &&
                `Somente ${matchCount} jogador visitou a mesma carta! Brilharam! 3 pontos para cada!`}
              {isRegularSpark && `${matchCount} jogadores visitaram a mesma carta! 2 pontos para cada.`}
            </>
          }
          en={
            <>
              <h2 className="g-announce-title">It's a match!</h2>
              {isSuperSpark &&
                `Only ${matchCount} player visited the same card! Super spark! Each gets 3 points!`}
              {isRegularSpark && `${matchCount} players visited the same card! Each gets 2 points.`}
            </>
          }
        />
      ) : (
        <Translate
          pt={
            <>
              <h2 className="g-announce-title">Vixi...</h2>
              Não sei o que dizer... Ninguém visitou essa carta e{' '}
              <AvatarName player={lastActivePlayer} size="small" addressUser /> está fora da rodada (suas
              cartas restantes ainda contaram pontos para outros jogadores).
            </>
          }
          en={
            <>
              <h2 className="g-announce-title">Oops...</h2>I don't know what to say... no one has visited this
              card and <AvatarName player={lastActivePlayer} size="small" addressUser /> is/are out of the
              round (your remaining cards still count towards scoring for other players).
            </>
          }
        />
      )}
    </div>
  );
}

type ListPlayersProps = {
  listPlayersIds: PlayerId[];
  players: GamePlayers;
  className: string;
};

function ListPlayers({ listPlayersIds, players, className }: ListPlayersProps) {
  return (
    <ul className={className}>
      {listPlayersIds.map((playerId) => (
        <li key={`${className}-${playerId}`}>
          <AvatarName player={players[playerId]} addressUser />
        </li>
      ))}
    </ul>
  );
}
