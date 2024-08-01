export interface SongsState {
    playlist: number[];
    currentSong: number | null; // ID de la canción actual
    prevSong: number | null; // ID de la canción anterior, o null si no hay anterior
    nextSong: number | null; // ID de la siguiente canción, o null si no hay siguiente
  }
  
  export type SongsAction =
    | { type: 'ADD_SONG'; payload: number }
    | { type: 'REMOVE_SONG'; payload: number }
    | { type: 'ADD_PLAYLIST'; payload: number[] }
    | { type: 'CLEAR_PLAYLIST'; payload: void }
    | { type: 'SET_CURRENT_SONG'; payload: number } // ID de la canción actual
    | { type: 'NEXT_SONG'; payload: void }
    | { type: 'PREV_SONG'; payload: void }
    | { type: 'REPLACE_PLAYLIST_WITH_SONG'; payload: number }; // Nueva acción
  
  export const initialState: SongsState = {
    playlist: [],
    currentSong: null,
    prevSong: null,
    nextSong: null
  };
  
  const getPrevNextSongs = (playlist: number[], currentSong: number | null) => {
    if (currentSong === null) return { prevSong: null, nextSong: null };
  
    const currentIndex = playlist.indexOf(currentSong);
    const prevSong = currentIndex > 0 ? playlist[currentIndex - 1] : null;
    const nextSong = currentIndex < playlist.length - 1 ? playlist[currentIndex + 1] : null;
  
    return { prevSong, nextSong };
  };
  
  export const songsReducer = (state: SongsState, action: SongsAction): SongsState => {
    switch (action.type) {
      case 'ADD_SONG': {
        if (state.playlist.includes(action.payload)) {
          // Si la canción ya está en la lista, no hacer nada
          return state;
        }
        const newPlaylist = [...state.playlist, action.payload];
        const newCurrentSong = state.currentSong === null ? action.payload : state.currentSong;
        const { prevSong, nextSong } = getPrevNextSongs(newPlaylist, newCurrentSong);
  
        return {
          ...state,
          playlist: newPlaylist,
          currentSong: newCurrentSong,
          prevSong,
          nextSong
        };
      }
      case 'REMOVE_SONG': {
        const newPlaylist = state.playlist.filter(id => id !== action.payload);
        const newCurrentSong = state.currentSong === action.payload
          ? (newPlaylist.length > 0 ? newPlaylist[0] : null) // Si se elimina la canción actual, selecciona la primera canción o `null` si la lista queda vacía
          : state.currentSong;
        const { prevSong, nextSong } = getPrevNextSongs(newPlaylist, newCurrentSong);
  
        return {
          ...state,
          playlist: newPlaylist,
          currentSong: newCurrentSong,
          prevSong,
          nextSong
        };
      }
      case 'ADD_PLAYLIST': {
        const filteredPlaylist = action.payload.filter(id => !state.playlist.includes(id));
        const newPlaylist = [...state.playlist, ...filteredPlaylist];
        const newCurrentSong = state.currentSong && !newPlaylist.includes(state.currentSong)
          ? newPlaylist.length > 0
            ? newPlaylist[0]
            : null
          : state.currentSong;
        const { prevSong, nextSong } = getPrevNextSongs(newPlaylist, newCurrentSong);
  
        return {
          ...state,
          playlist: newPlaylist,
          currentSong: newCurrentSong,
          prevSong,
          nextSong
        };
      }
      case 'CLEAR_PLAYLIST': {
        return {
          ...state,
          playlist: [],
          currentSong: null,
          prevSong: null,
          nextSong: null
        };
      }
      case 'SET_CURRENT_SONG': {
        const { prevSong, nextSong } = getPrevNextSongs(state.playlist, action.payload);
  
        return {
          ...state,
          currentSong: state.playlist.includes(action.payload) ? action.payload : null,
          prevSong,
          nextSong
        };
      }
      case 'NEXT_SONG': {
        if (state.currentSong === null || state.playlist.length === 0) return state;
  
        const currentIndex = state.playlist.indexOf(state.currentSong);
        const nextIndex = currentIndex + 1;
        const nextSong = nextIndex < state.playlist.length ? state.playlist[nextIndex] : null;
        const { prevSong } = getPrevNextSongs(state.playlist, nextSong);
  
        return {
          ...state,
          currentSong: nextSong,
          prevSong,
          nextSong: nextIndex < state.playlist.length - 1 ? state.playlist[nextIndex + 1] : null
        };
      }
      case 'PREV_SONG': {
        if (state.currentSong === null || state.playlist.length === 0) return state;
  
        const currentIndex = state.playlist.indexOf(state.currentSong);
        const prevIndex = currentIndex - 1;
        const prevSong = prevIndex >= 0 ? state.playlist[prevIndex] : null;
        const { nextSong } = getPrevNextSongs(state.playlist, prevSong);
  
        return {
          ...state,
          currentSong: prevSong,
          prevSong: prevIndex > 0 ? state.playlist[prevIndex - 1] : null,
          nextSong
        };
      }
      case 'REPLACE_PLAYLIST_WITH_SONG': {
        const newSong = action.payload;
        return {
          ...state,
          playlist: [newSong], // Reemplaza la playlist con la nueva canción
          currentSong: newSong, // Establece la canción actual a la nueva canción
          prevSong: null, // No hay canción anterior
          nextSong: null // No hay siguiente canción
        };
      }
      default:
        return state;
    }
  };
  