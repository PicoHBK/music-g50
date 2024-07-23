import { SongsType } from '../types/harmony';

export interface SongsState {
  song: SongsType | null;
}

export type SongsAction =
  | { type: 'SET_SONG'; payload: SongsType }
  | { type: 'UPDATE_SONG'; payload: SongsType };

// Estado inicial adaptado
const initialSong: SongsType = {
  id: 35,
  created_at: '2024-07-22T23:33:20.989788-03:00',
  updated_at: '2024-07-23T00:21:12.056609-03:00',
  title: 'Ya no se que hacer conmigo',
  year: undefined,
  duration: undefined,
  song_file: 'http://sandbox.academiadevelopers.com/media/harmonyhub/songs/Ya_no_se_que_hacer_conmigo_-_Cuarteto_de_nos.mp3',
  album: undefined,
  owner: 100,
  artists: [],
  genres: []
};

export const initialState: SongsState = {
  song: initialSong
};

export const songsReducer = (state: SongsState, action: SongsAction): SongsState => {
  switch (action.type) {
    case 'SET_SONG':
      return { ...state, song: action.payload };
    case 'UPDATE_SONG':
      return {
        ...state,
        song: state.song && state.song.id === action.payload.id ? action.payload : state.song
      };
    default:
      return state;
  }
};
