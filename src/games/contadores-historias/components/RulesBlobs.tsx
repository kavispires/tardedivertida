// Types
import type { GamePlayer } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatar } from '@components/player/PlayerAvatar';

type VotingRulesProps = {
  isUserTheStoryTeller: boolean;
};

export function VotingRules({ isUserTheStoryTeller }: VotingRulesProps) {
  return (
    <Translate
      pt={`${isUserTheStoryTeller ? 'Aguarde enquanto os outros jogadores selecionam as cartas' : 'Hora de selecionar a carta correta!'}
      <br/>
      Se todos acertarem ou todos errarem, cada jogador ganha {points2}, menos o contador de histórias.
      <br/>
      Se somente alguns acertarem, cada acertador e contador de histórias recebe {points3}.
      <br/>
      Sua carta (se você não for o contador de histórias) ganha {points1} se alguém selecionar.`}
      en={`${isUserTheStoryTeller ? 'Wait while other players select their cards' : 'Time to select the correct card!'}
      <br/>
      If every player gets it correct or wrong, each player but the storyteller gets {points2}.
      <br/>
      If only some get it correct, those players (and the storyteller) get {points3}.
      <br/>
      You get {points1} for every vote your card gets (if you are not the storyteller).`}
      values={{
        points1: <PointsHighlight value={1} />,
        points2: <PointsHighlight value={2} />,
        points3: <PointsHighlight value={3} />,
      }}
    />
  );
}

type ScoringRulesProps = {
  storyteller: GamePlayer;
};

export function ScoringRules({ storyteller }: ScoringRulesProps) {
  return (
    <Surface>
      <Translate
        pt="Hora de revelar a resposta correta!
        <br/>
        O Contador de Histórias {storyteller} ganha {points3} se pelo menos uma pessoa acertar (mas não todas).
        <br/>
        Cada jogador que votou corretamente ganha {points3}.
        <br/>
        Para cada voto que sua carta recebeu (menos {storyteller}), você ganha {points1}.
        <br/>
        Mas se todos jogadores votarem corretamente ou incorretamente, todos ganham {points2} e o Contador de Histórias não ganha nada."
        en="Time to reveal the answer!
        <br/>
        The Storyteller {storyteller} gets {points3} if at least one player got it correctly (but not all).
        <br/>
        Each player who voted correctly gets {points3}.
        <br/>
        Each vote your card receives grants you {points1} (except {storyteller}).
        <br/>
        But if all players vote correctly or incorrectly, they get {points2} each and the Storyteller gets nothing."
        values={{
          storyteller: (
            <PlayerAvatar
              avatarId={storyteller.avatarId}
              size="small"
            />
          ),
          points1: <PointsHighlight value={1} />,
          points2: <PointsHighlight value={2} />,
          points3: <PointsHighlight value={3} />,
        }}
      />
    </Surface>
  );
}
