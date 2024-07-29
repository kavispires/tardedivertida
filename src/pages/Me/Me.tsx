import { useTitle } from 'react-use';
import { useEffect } from 'react';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
// Components
import { LoginModal } from './components/LoginModal';
import { MeContent } from './components/MeContent';
// Sass
import './Me.scss';

function Me() {
  useTitle('Me - Tarde Divertida');
  const { isAuthenticated, currentUser } = useCurrentUserContext();
  const [, setLanguage] = useGlobalLocalStorage('language');

  useEffect(() => {
    if (currentUser.language) {
      setLanguage(currentUser.language);
    }
  }, [currentUser.language, setLanguage]);

  return (
    <MeContent user={currentUser} additionalContent={<LoginModal isAuthenticated={isAuthenticated} />} />
  );
}

export default Me;
