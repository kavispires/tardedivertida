import { useContext } from 'react';
// Services
import { AuthContext } from 'services/AuthProvider';

export const useCurrentUserContext = () => useContext(AuthContext);
