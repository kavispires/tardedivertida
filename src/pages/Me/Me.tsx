import { useEffect } from 'react';
import { useTitle } from 'react-use';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Internal
import { LoginModal } from './components/LoginModal';
import { MeContent } from './components/MeContent';
// Sass
import './Me.scss';

function Me() {
  useTitle('Me - Tarde Divertida');
  const { isAuthenticated, currentUser } = useCurrentUserContext();
  const [, setLanguage] = useGlobalLocalStorage('language');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentUser.language) {
      setLanguage(currentUser.language);
    }
  }, [currentUser.language]);

  return (
    <MeContent user={currentUser} additionalContent={<LoginModal isAuthenticated={isAuthenticated} />} />
  );
}

export default Me;
