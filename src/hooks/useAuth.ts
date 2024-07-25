import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { AuthState, AuthAction } from '../reducer/AuthReducer';

export const useAuthContext = (): {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a SongsProvider');
  }
  return context;
};
