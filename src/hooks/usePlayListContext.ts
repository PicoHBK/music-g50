import { PlaylistContext } from "@/context/playListContext";
import { useContext } from "react";

// Hook personalizado para usar el contexto
export const usePlaylistContext = () => {
    const context = useContext(PlaylistContext);
    if (context === undefined) {
      throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
  };