import { Typography } from 'antd';
import { Translate } from 'components/language';

export function Rules() {
  return (
    <Typography>
      <Translate
        pt={
          <>
            <li>Contribua com o banco de dados do TD!</li>
            <li>A cada 10 segundos, você irá ler uma expressão e desenhar.</li>
            <li>Após 6 expressões, ou 1 minuto, seus desenhos serão salvos no banco de dados.</li>
            <li>Tente fazer o melhor possível, evite pornografia, e foque nos detalhes.</li>
            <li>Boa sorte!</li>
          </>
        }
        en={
          <>
            <li>Contribute to TD's database!</li>
            <li>Every 10 seconds, you will read an expression and draw.</li>
            <li>After 6 expressions or 1 minute, your drawings will be saved in the database</li>
            <li>Try to do your best possible, avoid NSFW content, and focus on the details.</li>
            <li>Good luck!</li>
          </>
        }
      />
    </Typography>
  );
}
