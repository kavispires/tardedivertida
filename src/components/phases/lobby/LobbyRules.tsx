import { motion } from 'framer-motion';
// Ant Design Resources
import { Image, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';

export function LobbyRules() {
  const info = useGameInfoContext();
  const { language } = useLanguage();
  return (
    <motion.div
      className="lobby-step__rules"
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        <Translate pt="Revise as regras" en="Review the rules" />
      </Typography.Title>
      <Image.PreviewGroup
        fallback={`${PUBLIC_URL.RULES}no-rules.jpg`}
        preview={{
          countRender: (current, total) => (
            <Space direction="vertical" size="small" className="text-center">
              <span>{info.rules[language][current]}</span>
              <span>
                {current}/{total}
              </span>
            </Space>
          ),
        }}
      >
        <ul className="lobby-step__rule-list">
          {info.rules[language].map((rule, index) => (
            <li key={rule} className="lobby-step__rule">
              {index > 0 && (
                <Image
                  src={`${PUBLIC_URL.RULES}game-rule-${info.gameName}-${index}.jpg`}
                  width={96}
                  className="border-radius"
                  fallback={`${PUBLIC_URL.RULES}no-rules.jpg`}
                />
              )}
              <Typography.Paragraph style={{ marginBottom: 0 }}>{rule}</Typography.Paragraph>
            </li>
          ))}
        </ul>
      </Image.PreviewGroup>
    </motion.div>
  );
}
