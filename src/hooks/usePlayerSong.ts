import { useContext } from 'react';
import { SongsContext } from '../context/playerSong';
import { SongsState, SongsAction } from '../reducer/playerSong';

export const useSongsContext = (): {
  state: SongsState;
  dispatch: React.Dispatch<SongsAction>;
} => {
  const context = useContext(SongsContext);
  if (context === undefined) {
    throw new Error('useSongsContext must be used within a SongsProvider');
  }
  return context;
};
