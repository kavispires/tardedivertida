import { useMutation } from '@tanstack/react-query';
import { doc, setDoc } from 'firebase/firestore';
// Ant Design Resources
import { BugFilled } from '@ant-design/icons';
import { Button, type ButtonProps } from 'antd';
// Services
import { firestore } from 'services/firebase';
// Internal
import { DebugOnly } from './DebugOnly';

/**
 * Overwrite the state of a game in Firestore.
 */
export function DevSetState({
  type,
  state,
  gameId,
  gameName,
  ...rest
}: Omit<ButtonProps, 'onClick' | 'children'> & { gameId: string; gameName: string; state?: any }) {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      console.log('☠️ Overriding state');
      const docRef = doc(firestore, `games/${gameId}/${gameName}/state`);
      return setDoc(docRef, state);
    },
  });

  const handleClick = () => {
    if (state) {
      mutate();
    }
  };

  return (
    <DebugOnly devOnly>
      <Button
        icon={<BugFilled />}
        type={type ?? 'primary'}
        {...rest}
        loading={isPending}
        onClick={handleClick}
      >
        Force Set State
      </Button>
    </DebugOnly>
  );
}
