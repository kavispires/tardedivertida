// Utils
import { useCardWidth, useGlobalState } from 'hooks';
// Components
import { AvatarName, Instruction, Step, TimedButton, Title, Translate } from 'components';
import { MonsterCard } from './MonsterCard';
import { MonsterSketches } from './MonsterSketches';
import { Space } from 'antd';

type StepResultsProps = {
  currentMonster: Monster;
  goToNextStep: GenericFunction;
  sketches: Sketch[];
  user: Player | PlainObject;
  players: Players;
  mostVotes: PlayerId[];
  witnessVote: any;
  witness: Player | PlainObject;
};

type Sketches = {
  mostVotedSketches: Sketch[];
  otherSketches: Sketch[];
};

export function StepResults({
  sketches,
  players,
  currentMonster,
  goToNextStep,
  mostVotes,
  witnessVote,
  witness,
}: StepResultsProps) {
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 500);
  const [canvasSize] = useGlobalState('canvasSize');

  const { mostVotedSketches, otherSketches } = sketches.reduce(
    (acc: Sketches, sketch) => {
      if (mostVotes.includes(sketch.playerId)) {
        acc.mostVotedSketches.push(sketch);
      } else {
        acc.otherSketches.push(sketch);
      }
      return acc;
    },
    {
      mostVotedSketches: [],
      otherSketches: [],
    }
  );

  return (
    <Step fullWidth>
      <Title>
        {mostVotes.length > 1 ? (
          <Translate
            pt="Os monstros mais votados foram..."
            en="The monsters who got the most votes were..."
          />
        ) : (
          <Translate pt="O mostro mais votado foi..." en="The monster who got the most votes was..." />
        )}
      </Title>

      <Instruction contained>
        {mostVotes.length > 1 ? (
          <Translate pt="Esses jogadores ganharam 3 pontos cada." en="These players get 3 points each." />
        ) : (
          <Translate pt="Esse jogador ganha 3 pontos." en="This player gets 3 points." />
        )}
      </Instruction>

      <div className="r-monster-list">
        <MonsterCard currentMonster={currentMonster} style={{ width: `${canvasWidth * 1.5}px` }} />
        <MonsterSketches
          sketches={mostVotedSketches}
          players={players}
          canvasSize={canvasSize}
          canvasWidth={canvasWidth}
        />
      </div>

      <Instruction contained>
        {mostVotes.includes(witnessVote) ? (
          <Translate
            pt={
              <>
                A testemunha <AvatarName player={witness} /> votou no mais votado, logo, é uma testemunha
                confiável e ganha 3 pontos também.
              </>
            }
            en={
              <>
                The witness <AvatarName player={witness} /> voted with the group which means s(he) is a
                credible witness and gets 3 points as well.
              </>
            }
          />
        ) : (
          <Translate
            pt={
              <>
                A testemunha achou que o desenho de <AvatarName player={players[witnessVote]} /> foi o melhor,
                esse jogador ganha 1 ponto.
              </>
            }
            en={
              <>
                The witness thought that <AvatarName player={players[witnessVote]} />
                's sketch was the best, so s(he) gets 1 point.
              </>
            }
          />
        )}
      </Instruction>

      <TimedButton label="Ranking" duration={30} onExpire={goToNextStep} onClick={goToNextStep} />

      <Title level={3} className="r-other-sketches-title">
        <Translate pt="Outros desenhos" en="Other sketches" />
      </Title>

      <Space className="space-container" align="center">
        <MonsterSketches
          sketches={otherSketches}
          players={players}
          canvasSize={canvasSize / 1.5}
          canvasWidth={canvasWidth / 1.5}
        />
      </Space>
    </Step>
  );
}
