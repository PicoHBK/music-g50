import React, { createContext, useReducer, ReactNode } from 'react';
import { songsReducer, initialState, SongsState, SongsAction } from '../reducer/playerSong';

const SongsContext = createContext<{
  state: SongsState;
  dispatch: React.Dispatch<SongsAction>;
} | undefined>(undefined);

interface SongsProviderProps {
  children: ReactNode;
}

export const SongsProvider: React.FC<SongsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(songsReducer, initialState);

  return (
    <SongsContext.Provider value={{ state, dispatch }}>
      {children}
    </SongsContext.Provider>
  );
};

export { SongsContext };
