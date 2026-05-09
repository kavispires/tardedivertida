import { useEffect, useState } from 'react';
// Ant Design Resources
import { FireFilled } from '@ant-design/icons';
import { Modal, Typography, Space } from 'antd';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Components
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';

type StreakMilestoneModalProps = {
  /**
   * The milestone that was reached (e.g., 3, 7, 14, 30)
   */
  milestone: number | null;
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
};

export function StreakMilestoneModal({ milestone, onClose }: StreakMilestoneModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (milestone !== null) {
      setOpen(true);
      // Log analytics event
      logAnalyticsEvent('daily_streak_milestone', { days: milestone });
    }
  }, [milestone]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  if (milestone === null) {
    return null;
  }

  const getMilestoneMessage = (days: number): { pt: string; en: string } => {
    if (days >= 365) {
      return {
        pt: 'Incrível! Um ano inteiro de dedicação! 🎉',
        en: 'Amazing! A whole year of dedication! 🎉',
      };
    }
    if (days >= 100) {
      return {
        pt: 'Extraordinário! Você é imparável! 🌟',
        en: 'Extraordinary! You are unstoppable! 🌟',
      };
    }
    if (days >= 50) {
      return {
        pt: 'Fantástico! Meio caminho para 100! 🚀',
        en: 'Fantastic! Halfway to 100! 🚀',
      };
    }
    if (days >= 30) {
      return {
        pt: 'Um mês completo! Você é uma estrela! ⭐',
        en: 'A full month! You are a star! ⭐',
      };
    }
    if (days >= 14) {
      return {
        pt: 'Duas semanas seguidas! Continue assim! 💪',
        en: 'Two weeks in a row! Keep it up! 💪',
      };
    }
    if (days >= 7) {
      return {
        pt: 'Uma semana completa! Excelente trabalho! 🎊',
        en: 'A full week! Excellent work! 🎊',
      };
    }
    if (days >= 3) {
      return {
        pt: 'Três dias seguidos! Você está pegando o ritmo! 🔥',
        en: 'Three days in a row! You are getting the hang of it! 🔥',
      };
    }
    return {
      pt: 'Continue assim!',
      en: 'Keep it up!',
    };
  };

  const message = getMilestoneMessage(milestone);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={400}
    >
      <Space
        direction="vertical"
        align="center"
        style={{ width: '100%', padding: '24px 0' }}
        size="large"
      >
        <FireFilled
          style={{
            fontSize: '64px',
            color: '#ff4d4f',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />

        <Typography.Title
          level={2}
          style={{ margin: 0, textAlign: 'center' }}
        >
          <DualTranslate>
            {{
              pt: `${milestone} Dias de Sequência!`,
              en: `${milestone}-Day Streak!`,
            }}
          </DualTranslate>
        </Typography.Title>

        <Typography.Text style={{ fontSize: '16px', textAlign: 'center' }}>
          <DualTranslate>{message}</DualTranslate>
        </Typography.Text>

        <Typography.Text
          type="secondary"
          style={{ textAlign: 'center', fontSize: '14px' }}
        >
          <Translate
            pt="Continue jogando todos os dias para manter sua sequência!"
            en="Keep playing every day to maintain your streak!"
          />
        </Typography.Text>
      </Space>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </Modal>
  );
}
