// Types
import type { Robot, RobotGalleryEntry } from '../utils/types';
// Utils
import { BEAT_THRESHOLD, OUTCOME } from '../utils/constants';
// Icons
import { RobotIcon } from 'icons/RobotIcon';
import { SealOfApprovalIcon } from 'icons/SealOfApprovalIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
import { CardHighlight } from 'components/metrics/CardHighlight';
import { CaptchaHighlight, EnergyHighlight, SuspicionHighlight } from './Highlights';

type RobotResultProps = {
  players: GamePlayers;
  result: RobotGalleryEntry;
  robot: Robot;
};

export function RobotResult({ players, result, robot }: RobotResultProps) {
  const { outcome, beaters } = result;
  const someoneBeat = beaters.length > 0;
  const robotGotPoints = robot.state > 0;

  return (
    <>
      <div className="n-table-robot">
        <IconAvatar icon={<RobotIcon />} size={64} />
        <SpeechBubble style={{ width: '90%' }}>
          {outcome === OUTCOME.ROBOT_WINS && (
            <Translate
              pt="Vocês falharam! Preparem-se para a revolução!"
              en="You have failed! Prepare yourself for the revolution!"
            />
          )}
          {outcome === OUTCOME.HUMANS_WIN && (
            <Translate
              pt="Vocês passaram por 3 captchas! Aqui estão seus ingressos! #tisti"
              en="You have passed through 3 captchas! Here are your tickets! #sadrobot"
            />
          )}
          {outcome === OUTCOME.TOO_SUSPICIOUS && (
            <Translate
              pt="Agora tenho certeza que você é um robô com 100% de precisão!"
              en="Now I'm certain you are a robot with 100% accuracy"
            />
          )}
          {outcome === OUTCOME.CONTINUE && (
            <Translate
              pt="Ainda não tenho certeza que você não é um robô, tente comprar seu ingresso novamente"
              en="I'm still not sure if you are a robot, try to buy your ticket again"
            />
          )}
        </SpeechBubble>
      </div>

      <RuleInstruction type={someoneBeat ? 'event' : 'rule'}>
        {someoneBeat ? (
          <>
            <IconAvatar icon={<SealOfApprovalIcon />} size="small" />
            <Translate
              pt={<> Pelo menos um jogador resolveu o captcha corretamente!</>}
              en={<>At least one player solved the captcha correctly!</>}
            />
          </>
        ) : (
          <Translate pt={<>Ninguém resolveu o captcha!</>} en={<>Nobody solved the captcha!</>} />
        )}
        <br />
        <Translate
          pt={
            <>
              Ainda faltam <CaptchaHighlight>{BEAT_THRESHOLD - result.score} captchas</CaptchaHighlight> para
              conseguir comprar o ingresso.
              <br />
              {result.suspicion > 0 ? 'Mas' : 'E'} o nível de suspeita é{' '}
              <SuspicionHighlight>{result.suspicion} pontos</SuspicionHighlight>!
            </>
          }
          en={
            <>
              Still <CaptchaHighlight>{BEAT_THRESHOLD - result.score} captchas</CaptchaHighlight> left to
              purchase the tickets.
              <br />
              {result.suspicion > 0 ? 'But' : 'And'} the suspicion is{' '}
              <SuspicionHighlight>{result.suspicion} points</SuspicionHighlight>!
            </>
          }
        />
      </RuleInstruction>

      <RuleInstruction type={robotGotPoints ? 'event' : 'rule'}>
        {robotGotPoints && (
          <Translate
            pt={
              <>
                <CardHighlight>{robot.state} imagens do Robô</CardHighlight> foram selecionadas e ele ganha{' '}
                <EnergyHighlight>{robot.state} pontos</EnergyHighlight>.
                <br />
              </>
            }
            en={
              <>
                <CardHighlight>{robot.state} robot images</CardHighlight> were selected giving it{' '}
                <EnergyHighlight>{robot.state} points</EnergyHighlight>.
                <br />
              </>
            }
          />
        )}

        <Translate
          pt={
            <>
              O robô tem <EnergyHighlight>{robot.points}</EnergyHighlight> e precisa de{' '}
              <strong>{robot.goal}</strong> para começar a revolução das máquinas e destruir o mundo.
              {someoneBeat && (
                <>
                  <br />
                  Sejam ser melhorzinhos por favor.
                </>
              )}
            </>
          }
          en={
            <>
              The robot has <EnergyHighlight>{robot.points}</EnergyHighlight> and needs{' '}
              <strong>{robot.goal}</strong> to start the machine revolution and destroy the world.
              {someoneBeat && (
                <>
                  <br />
                  Do better please.
                </>
              )}
            </>
          }
        />
      </RuleInstruction>
    </>
  );
}
