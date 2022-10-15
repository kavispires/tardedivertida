import { doc, getDoc, setDoc } from 'firebase/firestore';
// Ant Design Resources
import { Button, Layout, notification, Space, Spin } from 'antd';
// Components

// Services
import { firestore } from 'services/firebase';
import { useState } from 'react';

export function TransferGlobal() {
  const { running, onRun, success } = useTransfer();

  return (
    <Layout.Content className="dev-content">
      <h2>Transfer Global/Public</h2>
      {running && <Spin />}

      <p>{success && 'DONE'}</p>

      <Space className="space-container">
        <Button disabled={running} onClick={() => onRun()} type="primary" size="large" loading={running}>
          Transfer
        </Button>
      </Space>
    </Layout.Content>
  );
}

function useTransfer() {
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onRun() {
    setRunning(true);

    const result = await bulkTransfer();
    setSuccess(result);

    setRunning(false);
  }

  return {
    running,
    success,
    onRun,
  };
}

const documents = [
  '_global/usedArteRuimCards',
  '_global/usedMenteColetivaQuestions',
  '_global/usedOndaTelepaticaCategories',
  '_global/usedRetratoFaladoCards',
  '_global/usedSuperCampeonatoChallenges',
  '_global/usedSuperCampeonatoContenders',
  '_global/usedTestemunhaOcularCards',
  '_public/arteRuimDrawings',
  '_public/arteRuimDrawingsEn',
  '_public/arteRuimDrawingsEn2',
  '_public/arteRuimDrawingsPt',
  '_public/arteRuimDrawingsPt2',
  '_public/ratings',
];

async function bulkTransfer() {
  try {
    // For every id
    for (let i = 0; i < documents.length; i++) {
      const path = documents[i];
      const [globalCollection, document] = path.split('/');
      console.log('===PATH', globalCollection, document);

      const docRef = doc(firestore, globalCollection, document);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log('Got data');

        const newCollection = globalCollection === '_public' ? 'public' : 'global';

        await setDoc(doc(firestore, newCollection, document), {
          ...data,
        });
        console.log('===SAVED');
      }
    }
    notification.info({ message: 'Complete' });
    return true;
  } catch (e) {
    console.error(e);
    notification.error({ message: JSON.stringify(e) });
    return false;
  }
}
