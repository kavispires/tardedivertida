import { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from 'services/firebase';
import { useEffectOnce } from 'react-use';
import type { AlienItemDict } from './types';
import { findLatestId } from './helpers';
import { isEmpty } from 'lodash';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { FIRST_ID } from './constants';

export function useItem(initialItem = FIRST_ID) {
  const [itemId, setItemId] = useState(initialItem);

  const previousItem = () => {
    setItemId((cur) => {
      return String(Number(cur) - 1);
    });
  };

  const nextItem = () => {
    setItemId((cur) => {
      return String(Number(cur) + 1);
    });
  };

  const goTo = (target: number | 'first' | 'last') => {
    setItemId((cur) => {
      if (target === 'first') {
        return FIRST_ID;
      }

      if (target === 'last') {
        return initialItem;
      }

      const curNum = Number(cur);
      const result = target + curNum;
      if (result > 0 && result <= Number(initialItem) + 1) {
        return String(Number(cur) + target);
      }

      if (target < 0) {
        return FIRST_ID;
      }

      return initialItem;
    });
  };

  return {
    itemId,
    previousItem,
    nextItem,
    setItemId,
    itemNumber: Number(itemId),
    goTo,
  };
}

export function useAlienItemsDocument(notificationApi: NotificationInstance) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<AlienItemDict>({});

  const docRef = doc(firestore, 'data/alienItems');

  async function queryAlienDoc() {
    if (success) return;

    try {
      setSuccess(false);
      setLoading(true);
      const querySnapshot = await getDoc(docRef);
      setData((querySnapshot.data() as AlienItemDict) ?? {});

      setSuccess(true);
      notificationApi.info({
        message: 'Data loaded',
        placement: 'bottomLeft',
      });
    } catch (e) {
      console.error(e);
      setError(true);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  async function saveAlienDoc(newData: AlienItemDict) {
    try {
      console.log('SAVING', newData);
      setSuccess(false);
      setSaving(true);
      await setDoc(docRef, newData);
      setData(newData);
      notificationApi.success({
        message: 'Saved',
        placement: 'bottomLeft',
      });
    } catch (e) {
      console.error(e);
      setError(true);
      setSuccess(false);
    } finally {
      setSaving(false);
    }
  }

  useEffectOnce(() => {
    if (isEmpty(data)) {
      queryAlienDoc();
    }
  });

  const latestId = String(findLatestId(data));

  return {
    isLoading: loading,
    isError: error,
    isSuccessful: success,
    isSaving: saving,
    data,
    setData,
    reload: queryAlienDoc,
    save: saveAlienDoc,
    latestId,
  };
}
