import React, { createContext, useReducer, ReactNode } from 'react';
import { songsReducer, initialState, SongsState, SongsAction } from '../reducer/playListReducer'; // Ajusta la ruta según sea necesario

export const PlaylistContext = createContext<{
  state: SongsState;
  dispatch: React.Dispatch<SongsAction>;
} | undefined>(undefined);

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(songsReducer, initialState);

  return (
    <PlaylistContext.Provider value={{ state, dispatch }}>
      {children}
    </PlaylistContext.Provider>
  );
};


